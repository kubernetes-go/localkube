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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publish = void 0;
const js_yaml_1 = require("js-yaml");
const fs_1 = require("fs");
const context_1 = require("./context");
const docker_1 = require("./docker");
const helm_1 = require("./helm");
const path_1 = __importDefault(require("path"));
function publish() {
    return __awaiter(this, void 0, void 0, function* () {
        let pipelineContext = new context_1.PipelineContext();
        pipelineContext.git = {
            branchName: 'master',
            commitHash: 'b7f5103'
        };
        try {
            let fileContents = fs_1.readFileSync(path_1.default.resolve(__dirname, './ci-cd.yaml'), 'utf8');
            let data = js_yaml_1.safeLoadAll(fileContents);
            let dockerPipeline = data.find(c => c.kind == 'docker');
            let dockerConfig = dockerPipeline;
            let dockerShell = new docker_1.DockerShell(dockerConfig, pipelineContext);
            yield dockerShell.build();
            yield dockerShell.push();
            let helmPipeline = data.find(c => c.kind == 'helm');
            let helmConfig = helmPipeline;
            let helmShell = new helm_1.HelmShell(helmConfig, pipelineContext);
            yield helmShell.addRepo();
            yield helmShell.publish();
        }
        catch (e) {
            console.log(e);
        }
    });
}
exports.publish = publish;
publish();
//# sourceMappingURL=index.js.map