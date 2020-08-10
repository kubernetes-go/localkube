import { exec, ExecOptions } from "child_process";
import * as util from "util";
import { resolve, relative } from "path";
import { Readable } from "stream";

export class Shell {
  public async execAsyncWithOptions(command: string, options?: ShellOptions) {
    let execPromise = util.promisify(exec);

    let currentProcessPath = process.cwd();

    let execPath = resolve(__dirname);
    if (options != undefined) {
      if (this.isValidExecPath(options.execRelativePath)) {
        execPath = relative(execPath, options.execRelativePath || "");
        let cdCommand = `cd ${options.execRelativePath} && `;
        let position = 0;
        let output = [
          command.slice(0, position),
          cdCommand,
          command.slice(position),
        ].join("");

        command = output;
      }
    }

    console.log(`running ${command} in ${currentProcessPath}`);

    let execResult = await execPromise(command);
    let printLog = true;
    if (options != undefined) {
      if (options.printLog != undefined) printLog = options.printLog;
    }
    if (printLog) console.log(execResult.stdout);
    if (execResult.stderr.length > 0) {
      console.log(execResult.stderr);
    }
    let result = new ShellResult(execResult);
    return result;
  }

  public async execAsync(command: string, execRelativePath?: string) {
    return await this.execAsyncWithOptions(command, {
      execRelativePath: execRelativePath,
    });
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
        let stdoutStream = childProcess.stdout as Readable;
        stdoutStream.on("data", (data) => {
          // Edit thomas.g: stdoutData = Buffer.concat([stdoutData, chunk]);
          stdoutData += data;
        });
        let stderrStream = childProcess.stdout as Readable;
        stderrStream.on("data", (data) => {
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

export class ShellOptions {
  public printLog?: boolean = true;
  public execRelativePath?: string;
}
export class ShellResult {
  constructor(execResult: { stdout: string; stderr: string }) {
    this.stdout = execResult.stdout;
    this.stderr = execResult.stderr;
  }
  public stdout?: string;
  public stderr?: string;
  public get isSuccessful() {
    return this.stderr == undefined || this.stderr == "";
  }
  public get isStdoutUndefinedOrEmpty() {
    return this.stdout == undefined || this.stdout == "";
  }

  public get stdoutTrimmed() {
    let stdout = this.stdout || "";
    let trimmed = stdout.replace(/(\r\n|\n|\r)/gm, "");
    return trimmed;
  }
}
