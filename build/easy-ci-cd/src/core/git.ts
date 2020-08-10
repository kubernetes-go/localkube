import { PipelineContext } from "./context";
import { Shell } from "./shell";
import { Render } from "./render";
import { KubectlShell } from "./kubectrl";
import { resolve } from "path";

export class GitShell {
  public config: GitConfig;
  public context: PipelineContext;
  constructor(config: GitConfig, context: PipelineContext) {
    this.config = config;
    this.context = context;
  }

  public async isCommitted() {
    let shellResult = await new Shell().execAsyncWithOptions(
      `git status --porcelain`
    );

    return shellResult.isStdoutUndefinedOrEmpty;
  }

  public async isSynced() {
    const local = await new Shell().execAsyncWithOptions(`git rev-parse @`);
    const remote = await new Shell().execAsyncWithOptions(`git rev-parse @{u}`);
    const base = await new Shell().execAsyncWithOptions(
      `git merge-base @ @{u}`
    );

    let result = false;

    if (local == remote) {
      console.log("Up-to-date");
    } else if (local == base) {
      console.log("Need to pull");
    } else if (remote == base) {
      console.log("Need to push");
    } else {
      console.log("Diverged");
      result = true;
    }

    return result;
  }

  public async isReady() {
    let ready = false;
    let committed = await this.isCommitted();
    if (!committed) {
      console.log("uncommitted changed found.");
      return false;
    }
    let synced = await this.isSynced();
    if (!synced) {
      console.log("out of sync found.");
      return false;
    }
    return ready;
  }

  public async getBranchName() {
    let branchNameResult = await new Shell().execAsyncWithOptions(
      `git rev-parse --abbrev-ref HEAD`
    );
    return branchNameResult.stdoutTrimmed;
  }

  public async getCommitHash() {
    let commitHashResult = await new Shell().execAsyncWithOptions(
      `git rev-parse --short HEAD`
    );
    return commitHashResult.stdoutTrimmed;
  }

  public async importContext(options: { force?: boolean }) {
    let force = true;
    if (options != undefined) {
      if (options.force != undefined) {
        force = options.force;
      }
    }
    console.log(`force is ${force}`);
    let clean = true;
    if (force) {
      clean = await this.isReady();
    }

    if (!clean) {
      console.error("please make sure git is up to date");
      return;
    }
    this.context.git.branchName = (await this.getBranchName()) as string;
    this.context.git.commitHash = (await this.getCommitHash()) as string;
    console.log(
      `branch is: ${this.context.git.branchName}`,
      `commit hash is: ${this.context.git.commitHash}`
    );
  }
}

export class GitConfig {}
