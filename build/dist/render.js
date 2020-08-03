"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Render = void 0;
const nunjucks = __importStar(require("nunjucks"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
class Render {
    constructor(context) {
        this.context = context;
    }
    render(files, outDir) {
        let currentDirectory = path_1.default.resolve(__dirname);
        let result = [];
        files.forEach(file => {
            let fileName = path_1.default.basename(file);
            let res = nunjucks.render(path_1.default.resolve(currentDirectory, file), this.context.variables);
            let outFile = path_1.default.resolve(currentDirectory, outDir, fileName);
            result.push(outFile);
            this.writeFile(outFile, res);
        });
        return result;
    }
    renderDir(dir, outDir) {
        let currentDirectory = path_1.default.resolve(__dirname);
        let fileNames = fs_1.readdirSync(path_1.default.resolve(currentDirectory, dir), 'utf-8');
        let files = fileNames.map(fileName => path_1.default.join(dir, fileName));
        return this.render(files, outDir);
    }
    writeFile(outFile, utf8Content) {
        let dir = path_1.default.dirname(outFile);
        if (!fs_1.existsSync(dir))
            fs_1.mkdirSync(dir);
        fs_1.writeFileSync(outFile, utf8Content);
    }
}
exports.Render = Render;
//# sourceMappingURL=render.js.map