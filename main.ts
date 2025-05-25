import { Camunda8 } from '@camunda8/sdk'

async function main() {
    const port = 26500;
    const c8 = new Camunda8({
        ZEEBE_ADDRESS: `localhost:${port}`,
        CAMUNDA_OAUTH_DISABLED: true,
        CAMUNDA_SECURE_CONNECTION: false,
        CAMUNDA_JOB_WORKER_MAX_BACKOFF_MS: 5000
    })
    const client = c8.getZeebeGrpcApiClient()
    await client.deployResource({processFilename: 'test.bpmn'})
    for(let i = 0; i < 2000; i++) {
    client.createWorker({
        taskType: 'test' + i,
        taskHandler: (job) => job.complete(),
        maxJobsToActivate: 20,
        timeout: 1000,
        loglevel: 'DEBUG',
    })
    }
}
main()