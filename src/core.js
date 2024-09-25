import { createContext, Script } from 'vm';
import { EventEmitter } from 'events';

import Runtime, { Request } from './runtime/index.js';

export class WorkerSandbox {
  constructor({ script }) {
    this.script = script;

    this.eventEmitter = this.initEmmitter();
    this.context = this.initContext();

    this.loadScript(script);
  }

  initEmmitter() {
    return new EventEmitter();
  }

  initContext() {
    const addEventListener = (type, listener) => {
      if (!this.eventEmitter) {
        this.eventEmitter = this.initEmmitter();
      }

      this.eventEmitter.on(type, listener);
    }

    return createContext({
      ...Runtime,
      addEventListener: addEventListener.bind(this),
      console, // 传递 console 到沙箱中以便调试
    });
  }

  loadScript(script) {
    const vmScript = new Script(script);
    vmScript.runInContext(this.context);
  }

  dispatchFetch(url, requestInit) {
    const request = new Request(url, requestInit);
    const responsePromise = new Promise((resolve) => {
      const event = {
        request,
        respondWith: (response) => {
          resolve(response);
        }
      };

      this.eventEmitter.emit('fetch', event);
    });

    return responsePromise;
  }

  dispose() {
    this.eventEmitter.removeAllListeners();
  }
}
