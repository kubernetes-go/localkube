import { Command, flags } from "@oclif/command";
import { PipelineContext } from "../core/context";
import { DockerShell } from "../core/docker";
import { GitShell } from "../core/git";

export default class Build extends Command {
  static description = "describe the command here";

  static examples = [`$ easy-ci-cd build -a web-api`];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    app: flags.string({ char: "a", description: "app to build" }),
  };

  static args = [{ name: "app" }];

  async run() {
    const { args, flags } = this.parse(Build);

    let pipelineContext: PipelineContext = new PipelineContext();
    let gitShell = new GitShell({}, pipelineContext);
    await gitShell.importContext({ force: false });
    try {
      const app = flags.app ?? "app";
      pipelineContext.loadBuildYaml(app);

      let dockerShell = new DockerShell(
        pipelineContext.docker.config,
        pipelineContext
      );
      await dockerShell.build();
      await dockerShell.push();
    } catch (e) {
      console.log(e);
    }
  }
}
