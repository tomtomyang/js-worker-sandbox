import { createContext, Script, Context, RunningScriptOptions } from 'vm';

import WorkerRuntime from '../runtime/index';

export type { Context };

export interface VMOptions {
  extend?: (context: Context) => Context;
}

export class WorkerVM {
  public readonly context: Context;

  constructor(vmOptions: VMOptions = {}) {
    let context = {
      ...(WorkerRuntime || {}),
    } as Context;

    context = vmOptions?.extend?.(context) ?? context;

    this.context = createContext(context, {
      name: 'JS Worker Sandbox',
      codeGeneration: {
        strings: false,
        wasm: true,
      },
    });
  }

  public evaluate<T = any>(script: string, options?: RunningScriptOptions): T {
    const vmScript = new Script(script);
    return vmScript.runInContext(this.context, options);
  }
}
