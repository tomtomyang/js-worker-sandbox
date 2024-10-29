import { VMContext, WorkerVM } from './vm';

export interface SandboxOptions {
  script?: string;
  extend?: (context: VMContext) => VMContext;
}

export class WorkerSandbox extends WorkerVM {
  private eventEmitter: Map<string, Array<(...args: any[]) => void>>;
  private script?: string;

  constructor(sandboxOptions: SandboxOptions = {}) {
    const { script } = sandboxOptions;

    const eventEmitter = new Map<string, Array<(...args: any[]) => void>>();

    const addEventListener = (
      type: string,
      listener: (...args: any[]) => void,
    ) => {
      const listeners = eventEmitter.get(type) || [];
      listeners.push(listener);
      eventEmitter.set(type, listeners);
    };

    super({
      extend: (context) => {
        return {
          ...context,
          console,
          addEventListener,
        };
      },
    });

    this.eventEmitter = eventEmitter;
    this.script = script;

    if (this.script) {
      this.evaluate(this.script);
    }
  }

  public async dispatchFetch(
    url: string,
    requestInit?: RequestInit,
  ): Promise<Response> {
    const request = new Request(url, requestInit);

    const response = new Promise<Response>((resolve, reject) => {
      const fetchListeners = this.eventEmitter.get('fetch') || [];

      const event = {
        request,
        respondWith: (response: Response | Promise<Response>) => {
          Promise.resolve(response)
            .then((r) => {
              if (r instanceof Response) {
                resolve(r);
              } else {
                reject(new Error('Invalid response'));
              }
            })
            .catch(reject);
        },
        waitUntil: (promise: Promise<any>) => {
          promise.catch(console.error);
        },
        passThroughOnException: () => {},
      };

      // 触发所有的 fetch 监听器
      fetchListeners.forEach((listener) => {
        try {
          listener(event);
        } catch (err) {
          reject(err);
        }
      });
    });

    return response;
  }

  public dispose(): void {
    this.eventEmitter.clear();
    super.destroy();
  }
}
