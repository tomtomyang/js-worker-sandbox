export interface VMContext {
  addEventListener: (type: string, listener: (...args: any[]) => void) => void;
  postMessage: (message: any) => void;
  [key: string]: any;
}

export interface VMOptions {
  extend?: (context: VMContext) => VMContext;
}

export class WorkerVM {
  protected worker: Worker;
  protected messageHandlers: Map<string, Set<(data: any) => void>>;

  constructor() {
    this.messageHandlers = new Map();
  }

  protected initVM(code: string): void {
    const blob = new Blob([code], { type: 'application/javascript' });
    this.worker = new Worker(URL.createObjectURL(blob));
    this.worker.onmessage = this.handleMessage.bind(this);
  }

  protected handleMessage(event: MessageEvent): void {
    const { type, data } = event.data;
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  protected addMessageHandler(
    type: string,
    handler: (data: any) => void,
  ): void {
    const handlers = this.messageHandlers.get(type) || new Set();
    handlers.add(handler);
    this.messageHandlers.set(type, handlers);
  }

  protected removeMessageHandler(
    type: string,
    handler: (data: any) => void,
  ): void {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  public evaluate(code: string): void {
    this.initVM(code);
  }

  public dispose(): void {
    this.worker?.terminate();
    this.messageHandlers.clear();
  }
}
