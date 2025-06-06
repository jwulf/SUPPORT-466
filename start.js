"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@camunda8/sdk");
// Clear the cache directory to avoid issues with stale tokens between runs
sdk_1.Auth.OAuthProvider.clearCacheDir();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const c8 = new sdk_1.Camunda8().getZeebeGrpcApiClient();
        yield c8.deployResource({ processFilename: './test.bpmn' });
        let n = 1;
        for (let i = 1; i < 6; i++) {
            console.log(`Sending command to create process instance ${i}...`);
            c8.createProcessInstance({
                bpmnProcessId: 'overload-zeebe',
                variables: { test: i },
                version: 1,
            }).then((res) => {
                console.log(`Process instance ${n++} created:`, res);
            }).catch((err) => {
                console.error('Error creating process instance:', err);
            });
        }
    });
}
main();
