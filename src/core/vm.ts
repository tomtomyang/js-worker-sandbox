import { createContext, Script, Context } from 'vm';
import { EventEmitter } from 'events';

import WorkerRuntime, {
  Request,
  Response,
  RequestInit,
} from '../runtime/index';

export class WorkerVM {
  private script: string;
  private eventEmitter: EventEmitter<[never]>;
  private context: Context;

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

  dispatchFetch(url: string, requestInit?: RequestInit) {
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
