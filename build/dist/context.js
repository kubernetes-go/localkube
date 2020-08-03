"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelmContext = exports.DockerContext = exports.CommonContext = exports.GitContext = exports.PipelineContext = void 0;
class PipelineContext {
    constructor() {
        this.docker = new DockerContext();
        this.common = new CommonContext();
        this.placeholders = new Map();
    }
    get variables() {
        let result = {};
        this.placeholders.forEach((v, k) => {
            result[k] = v;
        });
        return result;
    }
}
exports.PipelineContext = PipelineContext;
class GitContext {
}
exports.GitContext = GitContext;
class CommonContext {
}
exports.CommonContext = CommonContext;
class DockerContext {
}
exports.DockerContext = DockerContext;
class HelmContext {
}
exports.HelmContext = HelmContext;
//# sourceMappingURL=context.js.map