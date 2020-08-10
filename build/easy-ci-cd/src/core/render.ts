import * as nunjucks from "nunjucks";
import {
  writeFileSync,
  readdirSync,
  mkdirSync,
  existsSync,
  rmdirSync,
} from "fs";
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

  public renderDir(
    appChartFolderName: string,
    renderedChartValuesFolder: string
  ) {
    this.renderWithName(
      appChartFolderName,
      this.context.kubectl.contextName,
      renderedChartValuesFolder
    );
    this.renderShared(appChartFolderName, renderedChartValuesFolder);
  }

  public renderWithName(dir: string, nameKeyword: string, outDir: string) {
    let currentDirectory = resolve(this.context.cwd);
    let srcRelativePath = resolve(
      currentDirectory,
      this.context.appFolderName,
      dir
    );

    let outRelativePath = resolve(
      this.context.artifactFolderName,
      this.context.appFolderName,
      outDir
    );

    let files = this.nameWithInDir(srcRelativePath, nameKeyword);

    return this.render(files, outRelativePath);
  }

  public renderShared(
    appChartFolderName: string,
    renderedChartValuesFolder: string
  ) {
    let currentDirectory = resolve(this.context.cwd);
    let srcRelativePath = resolve(
      this.context.appFolderName,
      appChartFolderName
    );
    let outRelativePath = resolve(
      this.context.artifactFolderName,
      this.context.appFolderName,
      renderedChartValuesFolder
    );

    let fileNames = readdirSync(
      resolve(currentDirectory, this.context.appFolderName, appChartFolderName),
      "utf-8"
    ) as string[];

    let files = fileNames
      .filter((fileName) => this.isSharedFile(fileName))
      .map((fileName: string) => {
        return join(srcRelativePath, fileName);
      });

    return this.render(files, outRelativePath);
  }

  public chartFiles(renderedChartValuesFolder: string) {
    let dirFullPath = resolve(
      this.context.artifactFolderPath,
      renderedChartValuesFolder
    );
    let sharedChartFiles = this.sharedInDir(dirFullPath);
    let currentContextChartFiles = this.chartFilesWithName(
      this.context.kubectl.contextName,
      renderedChartValuesFolder
    );
    return sharedChartFiles.concat(currentContextChartFiles);
  }

  public chartFilesWithName(
    nameKeyword: string,
    renderedChartValuesFolder: string
  ) {
    const artifactFolderPullPath = resolve(
      this.context.artifactFolderPath,
      renderedChartValuesFolder
    );
    return this.nameWithInDir(artifactFolderPullPath, nameKeyword);
  }

  private isSharedFile(fileName: string) {
    const fileNameSubset = fileName.split(".");
    if (fileNameSubset.length <= 2) return true;
    return false;
  }

  public writeFile(outFile: string, utf8Content: string) {
    let dir = dirname(outFile);
    if (!existsSync(dir)) mkdirSync(dir);
    writeFileSync(outFile, utf8Content);
  }

  public clean() {
    let currentDirectory = resolve(this.context.cwd);
    let dir = resolve(
      currentDirectory,
      this.context.artifactFolderName,
      this.context.appFolderName
    );
    rmdirSync(dir, { recursive: true });
  }

  public nameWithInDir(dirFullPath: string, nameKeyword: string) {
    let srcRelativePath = dirFullPath;
    let fileNames = readdirSync(srcRelativePath, "utf-8") as string[];

    let files = fileNames
      .filter((fileName) => fileName.includes(nameKeyword))
      .map((fileName: string) => {
        return join(srcRelativePath, fileName);
      });
    return files;
  }

  public sharedInDir(dirFullPath: string) {
    let fileNames = readdirSync(dirFullPath, "utf-8") as string[];

    let files = fileNames
      .filter((fileName) => this.isSharedFile(fileName))
      .map((fileName: string) => {
        return join(dirFullPath, fileName);
      });

    return files;
  }
}
