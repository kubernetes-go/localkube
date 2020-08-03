export class PipelineContext {

    constructor() {
        this.docker = new DockerContext();
        this.common = new CommonContext();
        this.placeholders = new Map<string, string>();
    }
    public git: GitContext;
    public docker: DockerContext;
    public common: CommonContext;
    public placeholders: Map<string, string>;

    public get variables() {
        let result: { [key: string]: any } = {};
        this.placeholders.forEach((v, k) => {
            result[k] = v;
        });
        return result;
    }
}

export class GitContext {
    public branchName: string;
    public commitHash: string;
}

export class CommonContext {
    public timestamp: Date;
}

export class DockerContext {
    public image: string;
    public imageTag: string;
}

export class HelmContext {

}