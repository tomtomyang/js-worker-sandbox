"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerSandBox = void 0;
const fs_1 = require("fs");
const vm_js_1 = require("./vm.js");
function loadScript(script, scriptPath) {
    if (script &&
        typeof script === 'string' &&
        script.length > 0) {
        return script;
    }
    if (scriptPath &&
        typeof scriptPath === 'string' &&
        scriptPath.length > 0 &&
        scriptPath.endsWith('.js') &&
        (0, fs_1.existsSync)(scriptPath)) {
        return (0, fs_1.readFileSync)(scriptPath, 'utf8');
    }
    return '';
}
class WorkerSandBox extends vm_js_1.WorkerVM {
    constructor({ script = '', scriptPath = '' }) {
        const vmInitOptions = {
            script: loadScript(script, scriptPath),
        };
        super(vmInitOptions);
    }
}
exports.WorkerSandBox = WorkerSandBox;
