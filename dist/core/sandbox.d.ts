import { WorkerVM } from './vm.js';
export declare class WorkerSandBox extends WorkerVM {
    constructor({ script, scriptPath }: {
        script?: string | undefined;
        scriptPath?: string | undefined;
    });
}
