import { readFileSync, existsSync } from 'fs';
import { executionAsyncId } from 'async_hooks';

import { createContext, Script } from 'vm';
import { EventEmitter } from 'events';

import workerContext from './standards/index.js';

export class WorkerSandbox {
  constructor({ script = '', scriptPath = '', context = {} }) {
    this.script = this.loadScript(script, scriptPath);

    this.eventEmitter = this.initEmmitter();
    this.context = this.initContext(context);

    this.initScript();
  }

  initEmmitter() {
    return new EventEmitter();
  }

  initContext(customContext) {
    const addEventListener = (type, listener) => {
      if (!this.eventEmitter) {
        return;
      }

      this.eventEmitter.on(type, listener);
    }

    return createContext({
      ...(workerContext || {}),
      ...(customContext || {}),
      console,
      addEventListener: addEventListener.bind(this),
    });
  }

  loadScript(script, scriptPath) {
    if (
      script &&
      typeof script ==='string' &&
      script.length > 0
    ) {
      return script;
    }

    if (
      scriptPath &&
      typeof scriptPath ==='string' &&
      scriptPath.length > 0 &&
      scriptPath.endsWith('.js') &&
      existsSync(scriptPath)
    ) {
      return readFileSync(scriptPath, 'utf8');
    }

    return '';
  }

  initScript() {
    if (!this.script || !this.context) {
      return;
    }

    const vmScript = new Script(this.script);

    vmScript.runInContext(this.context, {
      timeout: 5000,
      displayErrors: true,
      asyncResource: {
        type: 'worker',
        triggerAsyncId: executionAsyncId(),
      },
    });
  }

  dispatchFetch(url, requestInit) {
    const request = new workerContext.Request(url, requestInit);
    const response = new Promise((resolve, reject) => {
      const event = {
        request,
        respondWith: (response) => {
          if (response instanceof workerContext.Response) {
            resolve(response);
          } else if (typeof response?.then === 'function') {
            response.then((fulfilled) => {
              if (fulfilled instanceof workerContext.Response) {
                resolve(fulfilled);
              } else {
                reject(new Error('Invalid response'));
              }
            }).catch(reject);
          } else {
            reject(new Error('Invalid response'));
          }
        },
        waitUntil: (promise) => {
          promise.then(() => {}).catch(console.error);
        },
      };

      this.eventEmitter.emit('fetch', event);
    });

    return response;
  }

  dispose() {
    this.eventEmitter.removeAllListeners();

    this.eventEmitter = null;
    this.context = null;
  }
}
