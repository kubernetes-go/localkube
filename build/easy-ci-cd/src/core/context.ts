import { resolve } from "path";
import { readFileSync } from "fs";
import { Render } from "./render";
import { safeLoadAll } from "js-yaml";
import { DockerConfig } from "./docker";
import { HelmConfig } from "./helm";

export class PipelineContext {
  constructor() {
    this.docker = new DockerContext();
    this.helm = new HelmContext();
    this.common = new CommonContext();
    this.placeholders = new Map<string, string>();
    this.kubectl = new KubectlContext();
    this.cwd = process.cwd();
    this.appFolderName = "app";
    this.artifactFolderName = "artifact";
    this.git = new GitContext();
  }

  public git: GitContext;

  public docker: DockerContext;

  public helm: HelmContext;

  public common: CommonContext;

  public kubectl: KubectlContext;

  public cwd: string;

  public appFolderName: string;

  public artifactFolderName: string;

  public placeholders: Map<string, string>;

  public get variables() {
    const result: { [key: string]: any } = {};
    this.placeholders.forEach((v, k) => {
      result[k] = v;
    });
    return result;
  }

  public loadBuildYaml(appFolderName: string) {
    this.appFolderName = appFolderName;
    let fileContents = readFileSync(
      resolve(this.cwd, appFolderName, "build.yaml"),
      "utf8"
    );
    let data = safeLoadAll(fileContents);
    let dockerPipeline = data.find((c) => c.kind == "docker");
    let dockerConfig: DockerConfig = dockerPipeline;
    this.docker.config = dockerConfig;

    let helmPipeline = data.find((c) => c.kind == "helm");
    let helmConfig: HelmConfig = helmPipeline;
    this.helm.config = helmConfig;
  }

  public async restoreFromTemp() {
    const tempFile = this.tempFilePath;
    const fileContents = readFileSync(tempFile, "utf8");
    this.placeholders = new Map(Object.entries(JSON.parse(fileContents)));
  }

  public saveToTemp() {
    const tempFile = this.tempFilePath;
    new Render(this).writeFile(
      tempFile,
      JSON.stringify(this.variables, null, 4)
    );
  }

  public get artifactFolderPath() {
    return resolve(this.cwd, this.artifactFolderName, this.appFolderName);
  }

  public get tempFilePath() {
    return resolve(
      this.cwd,
      this.artifactFolderName,
      this.appFolderName,
      this.contextFileName
    );
  }

  public get contextFileName() {
    return "context.json";
  }

  public clean() {
    new Render(this).clean();
  }
}

export class GitContext {
  public branchName!: string;
  public commitHash!: string;
}

export class CommonContext {
  public timestamp!: Date;
}

export class DockerContext {
  constructor() {
    this.config = new DockerConfig();
  }
  public image!: string;
  public imageTag!: string;
  public config: DockerConfig;
}

export class HelmContext {
  constructor() {
    this.config = new HelmConfig();
  }
  public config: HelmConfig;
}

export class KubectlContext {
  public clusterName!: string;

  public contextName!: string;
}
