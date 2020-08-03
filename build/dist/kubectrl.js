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
exports.KubeConfig = exports.KubectlShell = void 0;
const shell_1 = require("./shell");
class KubectlShell {
    constructor(context) {
        this.helmCommandAlias = 'kubectl';
        this.context = context;
    }
    switch(contextName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.current == contextName)
                return;
            let command = 'config';
            let commandLine = `${this.helmCommandAlias} ${command} use ${contextName}`;
            yield new shell_1.Shell().execAsync(commandLine);
        });
    }
}
exports.KubectlShell = KubectlShell;
class KubeConfig {
}
exports.KubeConfig = KubeConfig;
//# sourceMappingURL=kubectrl.js.map