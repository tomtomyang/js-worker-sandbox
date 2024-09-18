import { createContext, runInContext, Script } from 'vm';
import { EventEmitter } from 'events';

import { Request, Response, fetch } from './api.js';

export class WorkerSandbox {
  constructor({ script }) {
    this.script = script;
    this.eventEmitter = new EventEmitter();

    this.context = createContext({
      addEventListener: this.addEventListener.bind(this),
      fetch,
      Response,
      Request,
      console, // 传递 console 到沙箱中以便调试
    });

    this.loadScript(script);
  }

  addEventListener(type, listener) {
    this.eventEmitter.on(type, listener);
  }

  loadScript(script) {
    const vmScript = new Script(script);
    vmScript.runInContext(this.context);
  }

  async dispatchFetch(url) {
    const request = new Request(url);
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
