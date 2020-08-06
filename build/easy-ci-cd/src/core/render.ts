import * as nunjucks from "nunjucks";
import { writeFileSync, readdirSync, mkdirSync, existsSync } from "fs";
import { basename, resolve, join, dirname } from "path";
import { PipelineContext } from "./context";

export class Render {
  context: PipelineContext;
  constructor(context: PipelineContext) {
    this.context = context;
  }

  public render(files: Array<string>, outDir: string) {
    let currentDirectory = resolve(
      this.context.cwd,
      this.context.appFolderName
    );
    let result: Array<string> = [];
    files.forEach((file) => {
      let fileName = basename(file);
      let res = nunjucks.render(
        resolve(currentDirectory, file),
        this.context.variables
      );
      let outFile = resolve(currentDirectory, outDir, fileName);
      result.push(outFile);
      this.writeFile(outFile, res);
    });
    return result;
  }

  public renderDir(dir: string, outDir: string) {
    let currentDirectory = resolve(this.context.cwd);
    let srcRelativePath = resolve(this.context.appFolderName, dir);
    let outRelativePath = resolve("./artifact", outDir);
    console.log(
      `rendering files from ${srcRelativePath} to ${outRelativePath} in ${currentDirectory}`
    );
    let fileNames = readdirSync(
      resolve(currentDirectory, this.context.appFolderName, dir),
      "utf-8"
    ) as string[];

    let files = fileNames.map((fileName: string, i: number, a: string[]) =>
      join(srcRelativePath, fileName)
    );
    return this.render(files, outRelativePath);
  }

  public writeFile(outFile: string, utf8Content: string) {
    let dir = dirname(outFile);
    if (!existsSync(dir)) mkdirSync(dir);
    writeFileSync(outFile, utf8Content);
  }
}
