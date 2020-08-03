import { PipelineContext, DockerContext } from './context';
import { Shell } from './shell';
import path from 'path';


export class DockerShell {
    public config: DockerConfig;
    public context: PipelineContext;
    private dockerCommandAlias = 'docker';

    constructor(config: DockerConfig, context: PipelineContext) {
        this.config = config;
        this.context = context;
    }

    public async build() {
        let tagFormat = this.config.tagFormat || "gitBranchName-gitCommitHash";
        let command = 'build';
        let tag = tagFormat.replace('gitBranchName', this.context.git.branchName).replace('gitCommitHash', this.context.git.commitHash);
        let image = `${this.config.registry}/${this.config.repository}:${tag}`;
        let currentDirectory = path.resolve(__dirname);
        let filePath = path.resolve(currentDirectory, this.config.filePath);
        let buildPath = path.resolve(currentDirectory, this.config.buildPath);
        //let commandLine = `${this.dockerCommandAlias} ${command} -f ${filePath}/${this.config.fileName} -t ${image} ${buildPath}`;
        let commandLine = `${this.dockerCommandAlias} ${command} -f ${this.config.filePath}/${this.config.fileName} -t ${image} ${this.config.buildPath}`;
        let shell = new Shell();
        await shell.execAsync(commandLine,currentDirectory);
        if (this.context.docker == null) this.context.docker = new DockerContext();
        this.context.placeholders.set('dockerImage', image);
        this.context.docker.image = image;
        this.context.placeholders.set('dockerImageTag', tag);
        this.context.docker.imageTag = tag;
    }

    public async push() {
        let command = 'push';
        let commandLine = `${this.dockerCommandAlias} ${command} ${this.context.docker.image}`;
        let shell = new Shell();
        await shell.execAsync(commandLine);
    }
}

export class DockerConfig {
    public version: string;
    public kind: string;
    public registry: string;
    public repository: string;
    public tagFormat: string;
    public filePath: string;
    public fileName: string;
    public buildPath: string;
}