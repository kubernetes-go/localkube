import { Command, flags } from "@oclif/command";
import { PipelineContext } from "../core/context";

export default class Clean extends Command {
  static description = "describe the command here";

  static examples = [`$ eid clean -a web-api`];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    app: flags.string({ char: "a", description: "app to clean" }),
  };

  static args = [{ name: "app" }];

  async run() {
    const { args, flags } = this.parse(Clean);
    let pipelineContext: PipelineContext = new PipelineContext();
    try {
      const app = flags.app ?? "app";
      pipelineContext.loadBuildYaml(app);
      pipelineContext.clean();
    } catch (e) {
      console.log(e);
    }
  }
}
