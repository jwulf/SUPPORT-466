import { Camunda8, Auth } from '@camunda8/sdk'

const workerCount = Number.parseInt((process.env.WORKERS ?? '2000'), 10)
const loglevel = process.env.ZEEBE_CLIENT_LOG_LEVEL ?? 'ERROR'
// Clear the cache directory to avoid issues with stale tokens between runs - if we are running in an OAuth environment
Auth.OAuthProvider.clearCacheDir()
async function main() {
    const c8 = new Camunda8()

    const client = c8.getZeebeGrpcApiClient()

    for(let i = 0; i < workerCount; i++) {
    client.createWorker({
        taskType: 'test' + i,
        taskHandler: (job) => job.complete(),
        maxJobsToActivate: 20,
        timeout: 1000,
        loglevel: 'ERROR',
    })
    }
}
main()