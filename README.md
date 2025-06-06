# Reproducer for Issue 466

This is a minimal reproducer for https://github.com/camunda/camunda-8-js-sdk/issues/466

## Instructions

1. `docker compose up -d`
2. `source .env` # load env vars for connection
2. `npx ts-node main.ts` # Start workers
3. `npx ts-node start.ts` # Start processes in another window — source .env there too


