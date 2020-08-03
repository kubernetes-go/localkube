"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelmConfig = exports.HelmShell = void 0;
const shell_1 = require("./shell");
const render_1 = require("./render");
class HelmShell {
    constructor(config, context) {
        this.helmCommandAlias = 'helm';
        this.config = config;
        this.context = context;
        this.context.placeholders.set('appName', this.config.appName);
        this.context.placeholders.set('namespace', this.config.namespace);
    }
    addRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            let command = `repo add`;
            let commandLine = `${this.helmCommandAlias} ${command} ${this.config.repoName} ${this.config.repoUrl}`;
            yield new shell_1.Shell().execAsync(commandLine);
        });
    }
    install() {
        return __awaiter(this, void 0, void 0, function* () {
            let command = `install`;
            return yield this.deploy(command);
        });
    }
    upgrade() {
        return __awaiter(this, void 0, void 0, function* () {
            let command = `upgrade`;
            return yield this.deploy(command);
        });
    }
    uninstall() {
        return __awaiter(this, void 0, void 0, function* () {
            let command = `uninstall`;
            let commandLine = `${this.helmCommandAlias} ${command} -n ${this.config.namespace} ${this.appName}`;
        });
    }
    publish() {
        return __awaiter(this, void 0, void 0, function* () {
            let releaseExist = true;
            try {
                yield this.get();
            }
            catch (e) {
                releaseExist = false;
            }
            if (releaseExist) {
                yield this.upgrade();
            }
            else {
                yield this.install();
            }
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            let command = `get all`;
            let commandLine = `${this.helmCommandAlias} ${command} -n ${this.config.namespace} ${this.appName}`;
            return yield new shell_1.Shell().execAsync(commandLine);
        });
    }
    deploy(command) {
        return __awaiter(this, void 0, void 0, function* () {
            let render = new render_1.Render(this.context);
            var renderFiles = render.renderDir('./chart', './release');
            let valuesYamlCommandLine = this.join(renderFiles, '-f');
            let commandLine = `${this.helmCommandAlias} ${command} -n ${this.config.namespace} ${valuesYamlCommandLine} ${this.appName} ${this.config.chartName}`;
            yield new shell_1.Shell().execAsync(commandLine);
        });
    }
    replacePlaceholders() {
        let converted = new Array();
        this.context.placeholders.forEach((v, k) => {
            converted = converted.concat(`${k}=${v}`);
        });
        return this.join(converted, '--set');
    }
    join(commandParameters, separator) {
        let convertedCommandLine = commandParameters.join(` ${separator} `);
        return ` ${separator} ` + convertedCommandLine;
    }
    get appName() {
        let _appName = this.config.appName || 'app';
        return _appName;
    }
}
exports.HelmShell = HelmShell;
class HelmConfig {
}
exports.HelmConfig = HelmConfig;
//# sourceMappingURL=helm.js.map