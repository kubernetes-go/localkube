import { PipelineContext } from './context';
import { Shell } from './shell';

export class KubectlShell {
    public context: PipelineContext;
    private helmCommandAlias = 'kubectl';
    constructor(context: PipelineContext) {
        this.context = context;
    }

    public async switch(contextName: string) {
        let command = 'config';
        let commandLine = `${this.helmCommandAlias} ${command} use ${contextName}`;
        await new Shell().execAsync(commandLine);
        this.context.kubectl.contextName = contextName;
    }
}

export class KubeConfig {

}