export interface BrowserSandboxOptions {
  script?: string;
  scriptUrl?: string;
  extend?: (context: any) => any;
}

export class BrowserWorkerSandbox {
  private worker: Worker;
  private script: string;
  private eventListeners: Map<string, Set<(event: any) => void>>;

  constructor(sandboxOptions: BrowserSandboxOptions = {}) {
    const { script, extend } = sandboxOptions;

    this.eventListeners = new Map();
    this.script = this.initScript(script);

    const workerCode = `
      ${this.script}

      self.addEventListener = (type, listener) => {
        self.addEventListener(type, listener);
      };

      self.onmessage = (event) => {
        if (event.data.type === 'fetch') {
          const fetchEvent = {
            request: event.data.request,
            respondWith: (response) => {
              self.postMessage({ type: 'fetchResponse', response });
            },
            waitUntil: (promise) => {
              promise.then(() => {}).catch(console.error);
            },
            passThroughOnException: () => {}
          };
          self.dispatchEvent(new Event('fetch', fetchEvent));
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    this.worker = new Worker(URL.createObjectURL(blob));

    this.worker.onmessage = (event) => {
      if (event.data.type === 'fetchResponse') {
        const listeners = this.eventListeners.get('fetch') || new Set();
        listeners.forEach((listener) => listener(event.data.response));
      }
    };

    if (extend) {
      const extendedContext = extend({});
      Object.keys(extendedContext).forEach((key) => {
        this.worker.postMessage({
          type: 'extend',
          key,
          value: extendedContext[key],
        });
      });
    }
  }

  private initScript(script?: string): string {
    if (script && typeof script === 'string' && script.length > 0) {
      return script;
    }

    return '';
  }

  public async dispatchFetch(
    url: string,
    requestInit?: RequestInit,
  ): Promise<Response> {
    return new Promise((resolve) => {
      const fetchListener = (response: Response) => {
        resolve(response);
        const listeners = this.eventListeners.get('fetch') || new Set();
        listeners.delete(fetchListener);
      };

      const listeners = this.eventListeners.get('fetch') || new Set();
      listeners.add(fetchListener);
      this.eventListeners.set('fetch', listeners);

      this.worker.postMessage({
        type: 'fetch',
        request: { url, ...requestInit },
      });
    });
  }

  public dispose() {
    this.worker.terminate();
    this.eventListeners.clear();
  }
}
