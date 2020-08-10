import { Command, flags } from "@oclif/command";
import { PipelineContext } from "../core/context";
import { HelmShell } from "../core/helm";

export default class Package extends Command {
  static description = "describe the command here";

  static examples = [`$ easy-ci-cd package`];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    app: flags.string({ char: "a", description: "app to deploy" }),
    cluster: flags.string({ char: "c", description: "cluster to deploy" }),
  };

  static args = [{ name: "app" }, { name: "cluster" }];

  async run() {
    const { args, flags } = this.parse(Package);

    let pipelineContext: PipelineContext = new PipelineContext();

    try {
      const app = flags.app ?? "app";
      const cluster = flags.cluster;
      pipelineContext.loadBuildYaml(app);

      let helmShell = new HelmShell(
        pipelineContext.helm.config,
        pipelineContext
      );

      if (cluster == undefined) {
        await helmShell.publishAll();
      } else {
        await helmShell.publish(cluster);
      }
    } catch (e) {
      console.log(e);
    }
  }
}
