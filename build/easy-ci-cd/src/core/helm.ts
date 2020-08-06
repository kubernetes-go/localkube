import { PipelineContext } from "./context";
import { Shell } from "./shell";
import { Render } from "./render";
import { KubectlShell } from "./kubectrl";

export class HelmShell {
  public config: HelmConfig;
  public context: PipelineContext;
  private helmCommandAlias = "helm";

  constructor(config: HelmConfig, context: PipelineContext) {
    this.config = config;
    this.context = context;
    this.context.placeholders.set("appName", this.config.appName);
    this.context.placeholders.set("namespace", this.config.namespace);
  }

  public async addRepo() {
    let command = `repo add`;
    let commandLine = `${this.helmCommandAlias} ${command} ${this.config.repoName} ${this.config.repoUrl}`;
    await new Shell().execAsync(commandLine);
  }

  public async install() {
    let command = `install`;
    return await this.deploy(command);
  }

  public async upgrade() {
    let command = `upgrade`;
    return await this.deploy(command);
  }

  public async uninstall() {
    let command = `uninstall`;
    let commandLine = `${this.helmCommandAlias} ${command} -n ${this.config.namespace} ${this.appName}`;
  }

  public async publish() {
    let kubectrl = new KubectlShell(this.context);
    this.config.contexts.forEach(async (contextName) => {
      await kubectrl.switch(contextName);

      let releaseExist = true;
      try {
        await this.get();
      } catch (e) {
        releaseExist = false;
      }
      if (releaseExist) {
        await this.upgrade();
      } else {
        await this.install();
      }
    });
  }

  public async get() {
    let command = `get all`;
    let commandLine = `${this.helmCommandAlias} ${command} -n ${this.config.namespace} ${this.appName}`;
    return await new Shell().execAsync(commandLine);
  }

  public render() {
    let render = new Render(this.context);
    var renderFiles = render.renderDir(
      this.chartValuesFolder,
      this.renderedChartValuesFolder
    );
  }

  private async deploy(command: string) {
    let render = new Render(this.context);
    var renderFiles = render.renderDir(
      this.chartValuesFolder,
      this.renderedChartValuesFolder
    );
    //let fileNames = renderFiles.map(file => path.join(this.renderedChartValuesFolder, path.basename(file)));
    let valuesYamlCommandLine = this.join(renderFiles, "-f");
    let commandLine = `${this.helmCommandAlias} ${command} -n ${this.config.namespace} ${valuesYamlCommandLine} ${this.appName} ${this.config.chartName}`;
    await new Shell().execAsync(commandLine);
  }

  private replacePlaceholders(): string {
    let converted = new Array<string>();
    this.context.placeholders.forEach((v, k) => {
      converted = converted.concat(`${k}=${v}`);
    });
    return this.join(converted, "--set");
  }

  private join(commandParameters: Array<string>, separator: string) {
    let convertedCommandLine = commandParameters.join(` ${separator} `);
    return ` ${separator} ` + convertedCommandLine;
  }

  public get appName() {
    let _appName = this.config.appName || "app";
    return _appName;
  }

  public get chartValuesFolder() {
    let _chartName = this.config.valuesFolder || "./chart";
    return _chartName;
  }

  public get renderedChartValuesFolder() {
    return "./chart";
  }
}

export class HelmConfig {
  repoName!: string;
  repoUrl!: string;
  chartName!: string;
  valuesFolder!: string;
  namespace!: string;
  appName!: string;
  contexts!: Array<string>;
}
