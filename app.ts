import path from 'path'

import { loadPackageDefinition, Server, ServerCredentials } from '@grpc/grpc-js'
import { loadSync } from '@grpc/proto-loader'

import { Camunda8 } from '@camunda8/sdk'

function createServer(): Promise<{ server: Server; port: number }> {
    return new Promise((resolve, reject) => {
        // Load the protobuf definition
        const packageDefinition = loadSync(
            path.join(__dirname, '.', 'proto', 'zeebe.proto'),
            {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true,
            }
        )

        const zeebeProto = loadPackageDefinition(
            packageDefinition
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as unknown as { gateway_protocol: { Gateway: any } }

        // Create the server
        const server = new Server()

        // Add a service to the server
        server.addService(zeebeProto.gateway_protocol.Gateway.service, {
            ActivateJobs: (call: any) => {
                call.emit(
                    'error',
                    { code: 8, message: 'Backpressure triggered on server' },
                    null
                )
                call.end()
            },
        })

        const credentials = ServerCredentials.createInsecure()
        // Start the server
        server.bindAsync('localhost:50051', credentials, (err, port) => {
            if (err) {
                reject(err)
            }
            resolve({ server, port })
        })
    })
}
async function main() {
    const { port } = await createServer()
    const c8 = new Camunda8({
        ZEEBE_ADDRESS: `localhost:${port}`,
        CAMUNDA_OAUTH_DISABLED: true,
        CAMUNDA_SECURE_CONNECTION: false,

    })
    const client = c8.getZeebeGrpcApiClient()
    client.createWorker({
        taskType: 'test',
        taskHandler: (job) => job.complete(),
        maxJobsToActivate: 1,
        timeout: 1000,
    })
}
main()
