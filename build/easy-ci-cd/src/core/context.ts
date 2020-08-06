import { Render } from "./render";
import { resolve } from "path";
import { readFileSync } from "fs";

export class PipelineContext {
  constructor() {
    this.docker = new DockerContext();
    this.common = new CommonContext();
    this.placeholders = new Map<string, string>();
    this.kubectl = new KubectlContext();
    this.cwd = process.cwd();
    this.appFolderName = "app";
  }

  public git!: GitContext;
  public docker: DockerContext;
  public common: CommonContext;
  public kubectl: KubectlContext;
  public cwd: string;
  public appFolderName: string;
  public placeholders: Map<string, string>;

  public get variables() {
    let result: { [key: string]: any } = {};
    this.placeholders.forEach((v, k) => {
      result[k] = v;
    });
    return result;
  }

  public async restoreFromTemp() {
    let tempFile = resolve(this.cwd, "./artifact/context.json");
    let fileContents = readFileSync(tempFile, "utf8");
    this.placeholders = new Map(Object.entries(JSON.parse(fileContents)));
  }

  public async saveToTemp() {
    let tempFile = resolve(this.cwd, "./artifact/context.json");
    await new Render(this).writeFile(
      tempFile,
      JSON.stringify(this.variables, null, 4)
    );
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
  public image!: string;
  public imageTag!: string;
}

export class HelmContext {}

export class KubectlContext {
  public clusterName!: string;
  public contextName!: string;
}
