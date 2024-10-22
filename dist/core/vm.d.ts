import { Context } from 'vm';
import { EventEmitter } from 'events';
export declare class WorkerVM {
    script: string;
    eventEmitter: EventEmitter<[never]>;
    context: Context;
    constructor({ script }: {
        script?: string | undefined;
    });
    initEmmitter(): EventEmitter<[never]>;
    initContext(): Context;
    initScript(): void;
    dispatchFetch(url: string, requestInit: any): Promise<unknown>;
    dispose(): void;
}
