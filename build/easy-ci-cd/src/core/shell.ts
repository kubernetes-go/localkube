import { exec, ExecOptions } from "child_process";
import * as util from "util";
import { resolve, relative } from "path";

export class Shell {
  public async execAsync(command: string, execRelativePath?: string) {
    let execPromise = util.promisify(exec);

    let currentProcessPath = process.cwd();

    let execPath = resolve(__dirname);
    if (this.isValidExecPath(execRelativePath)) {
      execPath = relative(execPath, execRelativePath || "");
      let cdCommand = `cd ${execRelativePath} && `;
      let position = 0;
      let output = [
        command.slice(0, position),
        cdCommand,
        command.slice(position),
      ].join("");

      command = output;
    }
    console.log(`running ${command} in ${currentProcessPath}`);

    let result = await execPromise(command);

    console.log(result.stdout);
    if (result.stderr.length > 0) {
      console.log(result.stderr);
    }
    return result.stderr.length == 0;
  }

  public execPromise(
    command: string,
    options: ExecOptions
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise<{ stdout: string; stderr: string }>(
      (resolve, reject) => {
        let childProcess = exec(command, options);
        let stdoutData = "";
        let stderrData = "";
        childProcess.stdout.on("data", (data) => {
          // Edit thomas.g: stdoutData = Buffer.concat([stdoutData, chunk]);
          stdoutData += data;
        });

        childProcess.stderr.on("data", (data) => {
          stderrData += data;
        });

        childProcess.on("close", (code) => {
          resolve({ stdout: stdoutData, stderr: stderrData });
        });
        childProcess.on("error", (err) => {
          reject(err);
        });
      }
    );
  }

  private isValidExecPath(execRelativePath?: string) {
    return (
      execRelativePath != undefined &&
      execRelativePath != "" &&
      execRelativePath.length > 0
    );
  }
}
