import { readFileSync, existsSync } from 'fs';
import { EventEmitter } from 'events';

import { WorkerVM, Context } from './vm';
import { Request, Response, RequestInit } from '../runtime/index';

export interface SandboxOptions {
  script?: string;
  scriptPath?: string;
  extend?: (context: Context) => Context;
}

export class WorkerSandbox extends WorkerVM {
  public readonly script: string;
  private eventEmitter: EventEmitter;

  constructor(sandboxOptions: SandboxOptions = {}) {
    const { script, scriptPath } = sandboxOptions;

    const eventEmitter = new EventEmitter();

    const addEventListener = (
      type: string,
      listener: (...args: any[]) => void,
    ) => {
      eventEmitter.on(type, listener);
    };

    super({
      extend: (context) => {
        return { ...context, console, addEventListener };
      },
    });

    this.eventEmitter = eventEmitter;
    this.script = this.initScript(script, scriptPath);

    if (this.script) {
      this.evaluate(this.script, { timeout: 10000, displayErrors: true });
    }
  }

  private initScript(script?: string, scriptPath?: string) {
    if (script && typeof script === 'string' && script.length > 0) {
      return script;
    }

    if (
      scriptPath &&
      typeof scriptPath === 'string' &&
      scriptPath.length > 0 &&
      scriptPath.endsWith('.js') &&
      existsSync(scriptPath)
    ) {
      return readFileSync(scriptPath, 'utf8');
    }

    return '';
  }

  public dispatchFetch(url: string, requestInit?: RequestInit) {
    const request = new Request(url, requestInit);
    const response = new Promise<Response>((resolve, reject) => {
      const event = {
        request,
        respondWith: (response: Response | Promise<Response>) => {
          if (response instanceof Response) {
            resolve(response);
          } else if (
            typeof (response as Promise<Response>)?.then === 'function'
          ) {
            (response as Promise<Response>)
              .then((fulfilled) => {
                if (fulfilled instanceof Response) {
                  resolve(fulfilled);
                } else {
                  reject(new Error('Invalid response'));
                }
              })
              .catch(reject);
          } else {
            reject(new Error('Invalid response'));
          }
        },
        waitUntil: (promise: Promise<any>) => {
          promise.then(() => {}).catch(console.error);
        },
        passThroughOnException: () => {},
      };

      this.eventEmitter.emit('fetch', event);
    });

    return response;
  }

  public dispose() {
    this.eventEmitter.removeAllListeners();
  }
}
