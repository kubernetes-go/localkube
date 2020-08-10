import { PipelineContext, DockerContext } from "./context";
import { Shell } from "./shell";
import { resolve } from "path";

export class DockerShell {
  public config: DockerConfig;
  public context: PipelineContext;
  private dockerCommandAlias = "docker";

  constructor(config: DockerConfig, context: PipelineContext) {
    this.config = config;
    this.context = context;
  }

  public async build() {
    const tagFormat = this.config.tagFormat || "gitBranchName-gitCommitHash";
    const command = "build";
    const tag = tagFormat
      .replace("gitBranchName", this.context.git.branchName)
      .replace("gitCommitHash", this.context.git.commitHash);
    console.log(`tag is ${tag}`);
    const image = `${this.config.registry}/${this.config.repository}:${tag}`;
    const currentDirectory = resolve(
      this.context.cwd,
      this.context.appFolderName
    );
    console.log(`app folder name is ${this.context.appFolderName}`);
    const filePath = resolve(currentDirectory, this.config.filePath);
    const buildPath = resolve(currentDirectory, this.config.buildPath);
    const commandLine = `${this.dockerCommandAlias} ${command} -f ${filePath}/${this.config.fileName} -t ${image} ${buildPath}`;
    // let commandLine = `${this.dockerCommandAlias} ${command} -f ${this.config.filePath}/${this.config.fileName} -t ${image} ${this.config.buildPath}`;
    const shell = new Shell();
    await shell.execAsync(commandLine);
    if (this.context.docker == null) this.context.docker = new DockerContext();
    this.context.placeholders.set("dockerRepository", this.config.repository);
    this.context.placeholders.set("dockerImage", image);
    this.context.docker.image = image;
    this.context.placeholders.set("dockerImageTag", tag);
    this.context.docker.imageTag = tag;
    this.context.saveToTemp();
  }

  public async push() {
    const command = "push";
    const commandLine = `${this.dockerCommandAlias} ${command} ${this.context.docker.image}`;
    const shell = new Shell();
    await shell.execAsync(commandLine);
  }
}

export class DockerConfig {
  public version!: string;
  public kind!: string;
  public registry!: string;
  public repository!: string;
  public tagFormat!: string;
  public filePath!: string;
  public fileName!: string;
  public buildPath!: string;
}
