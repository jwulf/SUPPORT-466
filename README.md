# Reproducer for Issue 466

This is a minimal reproducer for https://github.com/camunda/camunda-8-js-sdk/issues/466

## Instructions

### Mocked service  

1. `npm i`
2. `npx ts-node app.ts`

Observe the backpressure log messages. 

App does not exit.

### Dockerized Zeebe

1. `docker up -d`
2. `npx ts-node main.ts`