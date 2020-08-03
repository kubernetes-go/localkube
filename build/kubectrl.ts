import { PipelineContext } from './context';
import { Shell } from './shell';

export class KubectlShell {
    public context: PipelineContext;
    private helmCommandAlias = 'kubectl';
    private current: string;
    constructor(context: PipelineContext) {
        this.context = context;
    }

    public async switch(contextName: string) {
        if (this.current == contextName) return;
        let command = 'config';
        let commandLine = `${this.helmCommandAlias} ${command} use ${contextName}`;
        await new Shell().execAsync(commandLine);
    }
}

export class KubeConfig {

}