import * as nunjucks from 'nunjucks';
import { writeFileSync, readdirSync, mkdirSync, existsSync, fstat } from 'fs';
import path from 'path';
import { PipelineContext } from './context';

export class Render {
    context: PipelineContext;
    constructor(context: PipelineContext) {
        this.context = context;
    }

    public render(files: Array<string>, outDir: string) {
        let currentDirectory = path.resolve(__dirname);
        let result: Array<string> = [];
        files.forEach(file => {
            let fileName = path.basename(file);
            let res = nunjucks.render(path.resolve(currentDirectory, file), this.context.variables);
            let outFile = path.resolve(currentDirectory, outDir, fileName);
            result.push(outFile);
            this.writeFile(outFile, res);
        });
        return result;
    }

    public renderDir(dir: string, outDir: string) {
        let currentDirectory = path.resolve(__dirname);
        let fileNames = readdirSync(path.resolve(currentDirectory, dir), 'utf-8');
        let files = fileNames.map(fileName => path.join(dir, fileName));
        return this.render(files, outDir);
    }

    public writeFile(outFile: string, utf8Content: string) {
        let dir = path.dirname(outFile);
        if (!existsSync(dir)) mkdirSync(dir);
        writeFileSync(outFile, utf8Content);
    }
}