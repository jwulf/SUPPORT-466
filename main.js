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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@camunda8/sdk");
const workerCount = Number.parseInt(((_a = process.env.WORKERS) !== null && _a !== void 0 ? _a : '2000'), 10);
// Clear the cache directory to avoid issues with stale tokens between runs
sdk_1.Auth.OAuthProvider.clearCacheDir();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const c8 = new sdk_1.Camunda8();
        const client = c8.getZeebeGrpcApiClient();
        for (let i = 0; i < workerCount; i++) {
            client.createWorker({
                taskType: 'test' + i,
                taskHandler: (job) => job.complete(),
                maxJobsToActivate: 20,
                timeout: 1000,
                // loglevel: 'DEBUG',
            });
        }
    });
}
main();
