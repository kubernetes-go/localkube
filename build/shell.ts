import { exec } from 'child_process';
import * as util from 'util';
import path from 'path';

export class Shell {

    public async execAsync(command: string, execPath?: string) {

        let execPromise = util.promisify(exec);
        console.log(`running ${command} in ${this.isValidExecPath(execPath) ? execPath : process.cwd()}...`);
        let { stdout, stderr } = execPath != undefined && execPath != '' ? await execPromise(command, { cwd: execPath }) : await execPromise(command);
        console.log(stdout);
        if (stderr.length > 0) {
            console.log(stderr);
        }
        return stderr.length == 0;
    }

    private isValidExecPath(execPath?: string) {
        return execPath != undefined && execPath != '' && execPath.length > 0;
    }
}