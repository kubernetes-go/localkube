import { Command, flags } from "@oclif/command";
import { safeLoadAll } from "js-yaml";
import { readFileSync } from "fs";
import {
  PipelineContext,
  CommonContext,
  DockerContext,
  HelmContext,
} from "../core/context";
import { DockerShell, DockerConfig } from "../core/docker";
import { HelmConfig, HelmShell } from "../core/helm";
import { resolve } from "path";

export default class Package extends Command {
  static description = "describe the command here";

  static examples = [
    `$ easy-ci-cd build
hello world from ./src/hello.ts!
`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    app: flags.string({ char: "a", description: "app to package" }),
  };

  static args = [{ name: "app" }];

  async run() {
    const { args, flags } = this.parse(Package);

    let pipelineContext: PipelineContext = new PipelineContext();
    pipelineContext.git = {
      branchName: "master",
      commitHash: "b7f5103",
    };

    try {
      const app = flags.app ?? "app";
      pipelineContext.appFolderName = app;
      await pipelineContext.restoreFromTemp();
      let fileContents = readFileSync(
        resolve(pipelineContext.cwd, app, "build.yaml"),
        "utf8"
      );
      let data = safeLoadAll(fileContents);

      let helmPipeline = data.find((c) => c.kind == "helm");
      let helmConfig: HelmConfig = helmPipeline;

      let helmShell = new HelmShell(helmConfig, pipelineContext);
      helmShell.render();
    } catch (e) {
      console.log(e);
    }
  }
}
