import { Camunda8, Auth } from '@camunda8/sdk'

// Clear the cache directory to avoid issues with stale tokens between runs
Auth.OAuthProvider.clearCacheDir()
async function main() {
const c8 = new Camunda8().getZeebeGrpcApiClient()
    
await c8.deployResource({processFilename: './test.bpmn'})
let n = 1
    for(let i = 1; i < 6; i++) {
    console.log(`Sending command to create process instance ${i}...`)
    c8.createProcessInstance({
        bpmnProcessId: 'overload-zeebe',
        variables: { test: i },
        version: 1,
    }).then((res) => {
        console.log(`Process instance ${n++} created:`, res)
    }).catch((err) => {
        console.error('Error creating process instance:', err)
    })
    }
}

main()