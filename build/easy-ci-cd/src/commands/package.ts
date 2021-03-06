import { Command, flags } from "@oclif/command";
import { PipelineContext } from "../core/context";
import { HelmShell } from "../core/helm";

export default class Package extends Command {
  static description = "describe the command here";

  static examples = [`$ easy-ci-cd package`];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    app: flags.string({ char: "a", description: "app to package" }),
  };

  static args = [{ name: "app" }];

  async run() {
    const { args, flags } = this.parse(Package);

    let pipelineContext: PipelineContext = new PipelineContext();

    try {
      const app = flags.app ?? "app";
      pipelineContext.loadBuildYaml(app);
      pipelineContext.restoreFromTemp();
      let helmShell = new HelmShell(
        pipelineContext.helm.config,
        pipelineContext
      );

      pipelineContext.restoreFromTemp();
      pipelineContext.placeholders.set("eidVersion", this.config.version);
      helmShell.render();
    } catch (e) {
      console.log(e);
    }
  }
}
