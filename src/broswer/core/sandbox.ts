import { WorkerVM } from './vm';

export const createWorkerCode = (userScript: string) => `
  async function serializeResponse(response) {
    return {
      body: await response.text(),
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      type: response.type,
      url: response.url
    };
  }

  class FetchEvent extends CustomEvent {
    constructor(request) {
      super('fetch', {
        detail: { request },
      });
    }

    async respondWith(response) {
      const serializedResponse = await serializeResponse(response);
      self.postMessage({ 
        type: 'workerResponse', 
        data: serializedResponse 
      });
    };

    waitUntil(promise) {
      promise.then(() => {}).catch(console.error);
    };

    passThroughOnException() {};

    get request() {
      return this.detail.request;
    }
  }

  ${userScript}

  self.onmessage = (event) => {
    if (event.data.type === 'workerRequest') {
      const { url, requestInit } = event.data?.request || {};
      const request = new Request(url, requestInit);

      const fetchEvent = new FetchEvent(request);
      self.dispatchEvent(fetchEvent);
    }
  };
`;

export interface SandboxOptions {
  script?: string;
}

export class WorkerSandbox extends WorkerVM {
  private script: string;

  constructor(sandboxOptions: SandboxOptions = {}) {
    const { script = '' } = sandboxOptions;

    super();

    this.script = script;

    if (this.script) {
      const workerCode = createWorkerCode(this.script);
      this.evaluate(workerCode);
    }
  }

  public async dispatchFetch(
    url: string,
    requestInit?: RequestInit,
  ): Promise<Response> {
    return new Promise((resolve) => {
      const responseHandler = (responseData: any) => {
        const { body, status, statusText, headers } = responseData;
        const response = new Response(body, {
          status,
          statusText,
          headers: new Headers(headers),
        });
        resolve(response);
        this.removeMessageHandler('workerResponse', responseHandler);
      };

      this.addMessageHandler('workerResponse', responseHandler);

      this.worker.postMessage({
        type: 'workerRequest',
        request: { url, requestInit },
      });
    });
  }
}
