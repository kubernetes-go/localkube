import { PipelineContext } from "./context";
import { Shell } from "./shell";
import { Render } from "./render";
import { KubectlShell } from "./kubectrl";
import { resolve } from "path";

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

  public async updateRepo() {
    let command = `repo update`;
    let commandLine = `${this.helmCommandAlias} ${command}`;
    await new Shell().execAsync(commandLine);
  }

  public async install(clusterContextName: string) {
    let command = `install`;
    return await this.deploy(command, clusterContextName);
  }

  public async upgrade(clusterContextName: string) {
    let command = `upgrade`;
    return await this.deploy(command, clusterContextName);
  }

  public async uninstall() {
    let command = `uninstall`;
    let commandLine = `${this.helmCommandAlias} ${command} -n ${this.config.namespace} ${this.appName}`;
  }

  public async publish(clusterContextName: string) {
    let kubectrl = new KubectlShell(this.context);
    await kubectrl.switch(clusterContextName);

    let releaseExist = true;
    try {
      await this.get(clusterContextName);
    } catch (e) {
      releaseExist = false;
    }
    if (releaseExist) {
      await this.upgrade(clusterContextName);
    } else {
      await this.install(clusterContextName);
    }
  }

  public async publishAll() {
    this.config.contexts.forEach(async (contextName) => {
      await this.publish(contextName);
    });
  }

  public async get(clusterContextName: string) {
    let command = `get all`;
    let useKubeconfig = this.useKubeconfig(clusterContextName);
    let commandLine = `${this.helmCommandAlias} ${command} ${useKubeconfig} -n ${this.config.namespace} ${this.appName}`;
    return await new Shell().execAsyncWithOptions(commandLine, {
      printLog: false,
    });
  }

  public render() {
    let render = new Render(this.context);
    this.config.contexts.forEach((contextName) => {
      this.context.kubectl.contextName = contextName;
      this.context.placeholders.set("contextName", contextName);
      render.renderDir(this.chartValuesFolder, this.renderedChartValuesFolder);
    });
  }

  private async deploy(command: string, clusterContextName: string) {
    let render = new Render(this.context);
    let fileNames = render.chartFiles(this.renderedChartValuesFolder);
    let valuesYamlCommandLine = this.join(fileNames, "-f");
    let kubeconfigCommand = this.useKubeconfig(clusterContextName);
    let namespaceCommand = `-n ${this.config.namespace}`;
    let commandLine = `${this.helmCommandAlias} ${command} ${kubeconfigCommand} ${namespaceCommand} ${valuesYamlCommandLine} ${this.appName} ${this.config.chartName}`;
    await new Shell().execAsync(commandLine);
  }

  private useKubeconfig(clusterContextName: string) {
    let kubeconfigPath = resolve(
      this.context.cwd,
      this.config.kubeconfig,
      `${clusterContextName}.yaml`
    );
    return ` --kubeconfig ${kubeconfigPath}`;
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
    return this.config.valuesFolder;
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
  kubeconfig!: string;
}
