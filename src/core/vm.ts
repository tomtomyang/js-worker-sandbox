import { createContext, Script, Context } from 'vm';
import { EventEmitter } from 'events';

import WorkerRuntime from '../runtime/index.js';

export class WorkerVM {
  script: string;
  eventEmitter: EventEmitter<[never]>;
  context: Context;

  constructor({ script = '' }) {
    this.script = script;

    this.eventEmitter = this.initEmmitter();
    this.context = this.initContext();

    this.initScript();
  }

  initEmmitter() {
    return new EventEmitter();
  }

  initContext() {
    const addEventListener = (
      type: string,
      listener: (...args: any[]) => void,
    ) => {
      if (!this.eventEmitter) {
        throw new Error('Event emitter not initialized');
      }

      this.eventEmitter.on(type, listener);
    };

    return createContext(
      {
        ...(WorkerRuntime || {}),
        console,
        addEventListener: addEventListener.bind(this),
      },
      {
        name: 'JS Worker Sandbox',
        codeGeneration: {
          strings: false,
          wasm: true,
        },
      },
    );
  }

  initScript() {
    if (!this.script || !this.context) {
      throw new Error('Script or context not initialized');
    }

    const vmScript = new Script(this.script);

    vmScript.runInContext(this.context, {
      timeout: 5000,
      displayErrors: true,
    });
  }

  dispatchFetch(url: string, requestInit: any) {
    const request = new WorkerRuntime.Request(url, requestInit);
    const response = new Promise((resolve, reject) => {
      const event = {
        request,
        respondWith: (response: Response | Promise<Response>) => {
          if (response instanceof WorkerRuntime.Response) {
            resolve(response);
          } else if (
            typeof (response as Promise<Response>)?.then === 'function'
          ) {
            (response as Promise<Response>)
              .then((fulfilled) => {
                if (fulfilled instanceof WorkerRuntime.Response) {
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
      };

      this.eventEmitter.emit('fetch', event);
    });

    return response;
  }

  dispose() {
    this.eventEmitter.removeAllListeners();
    this.context = {};
  }
}
