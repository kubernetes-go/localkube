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
exports.DockerConfig = exports.DockerShell = void 0;
const context_1 = require("./context");
const shell_1 = require("./shell");
const path_1 = __importDefault(require("path"));
class DockerShell {
    constructor(config, context) {
        this.dockerCommandAlias = 'docker';
        this.config = config;
        this.context = context;
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            let tagFormat = this.config.tagFormat || "gitBranchName-gitCommitHash";
            let command = 'build';
            let tag = tagFormat.replace('gitBranchName', this.context.git.branchName).replace('gitCommitHash', this.context.git.commitHash);
            let image = `${this.config.registry}/${this.config.repository}:${tag}`;
            let currentDirectory = path_1.default.resolve(__dirname);
            let filePath = path_1.default.resolve(currentDirectory, this.config.filePath);
            let buildPath = path_1.default.resolve(currentDirectory, this.config.buildPath);
            //let commandLine = `${this.dockerCommandAlias} ${command} -f ${filePath}/${this.config.fileName} -t ${image} ${buildPath}`;
            let commandLine = `${this.dockerCommandAlias} ${command} -f ${this.config.filePath}/${this.config.fileName} -t ${image} ${this.config.buildPath}`;
            let shell = new shell_1.Shell();
            yield shell.execAsync(commandLine, currentDirectory);
            if (this.context.docker == null)
                this.context.docker = new context_1.DockerContext();
            this.context.placeholders.set('dockerImage', image);
            this.context.docker.image = image;
            this.context.placeholders.set('dockerImageTag', tag);
            this.context.docker.imageTag = tag;
        });
    }
    push() {
        return __awaiter(this, void 0, void 0, function* () {
            let command = 'push';
            let commandLine = `${this.dockerCommandAlias} ${command} ${this.context.docker.image}`;
            let shell = new shell_1.Shell();
            yield shell.execAsync(commandLine);
        });
    }
}
exports.DockerShell = DockerShell;
class DockerConfig {
}
exports.DockerConfig = DockerConfig;
//# sourceMappingURL=docker.js.map