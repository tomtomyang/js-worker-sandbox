export interface VMContext extends Window {
  Array?: typeof Array;
  ArrayBuffer?: typeof ArrayBuffer;
  Atomics?: typeof Atomics;
  BigInt?: typeof BigInt;
  BigInt64Array?: typeof BigInt64Array;
  BigUint64Array?: typeof BigUint64Array;
  Boolean?: typeof Boolean;
  DataView?: typeof DataView;
  Date?: typeof Date;
  decodeURI?: typeof decodeURI;
  decodeURIComponent?: typeof decodeURIComponent;
  encodeURI?: typeof encodeURI;
  encodeURIComponent?: typeof encodeURIComponent;
  Error?: typeof Error;
  EvalError?: typeof EvalError;
  Float32Array?: typeof Float32Array;
  Float64Array?: typeof Float64Array;
  Function?: typeof Function;
  // Infinity?: typeof Infinity;
  Int8Array?: typeof Int8Array;
  Int16Array?: typeof Int16Array;
  Int32Array?: typeof Int32Array;
  Intl?: typeof Intl;
  isFinite?: typeof isFinite;
  isNaN?: typeof isNaN;
  JSON?: typeof JSON;
  Map?: typeof Map;
  Math?: typeof Math;
  Number?: typeof Number;
  Object?: typeof Object;
  parseFloat?: typeof parseFloat;
  parseInt?: typeof parseInt;
  Promise?: typeof Promise;
  Proxy?: typeof Proxy;
  RangeError?: typeof RangeError;
  ReferenceError?: typeof ReferenceError;
  RegExp?: typeof RegExp;
  Set?: typeof Set;
  SharedArrayBuffer?: typeof SharedArrayBuffer;
  String?: typeof String;
  Symbol?: typeof Symbol;
  SyntaxError?: typeof SyntaxError;
  TypeError?: typeof TypeError;
  Uint8Array?: typeof Uint8Array;
  Uint8ClampedArray?: typeof Uint8ClampedArray;
  Uint16Array?: typeof Uint16Array;
  Uint32Array?: typeof Uint32Array;
  URIError?: typeof URIError;
  WeakMap?: typeof WeakMap;
  WeakSet?: typeof WeakSet;
  [key: string]: any;
}

export interface VMOptions {
  extend?: (context: VMContext) => VMContext;
}

export class WorkerVM {
  private iframe: HTMLIFrameElement;
  public readonly context: VMContext;

  constructor(vmOptions: VMOptions = {}) {
    this.iframe = document.createElement('iframe');
    this.iframe.style.display = 'none';
    document.body.appendChild(this.iframe);

    let context = this.iframe.contentWindow as VMContext;

    context = vmOptions?.extend?.(context) ?? context;

    this.context = context;
  }

  public evaluate<T = any>(script: string): T {
    return new Function('with(this) { return ' + script + ' }').call(
      this.context,
    );
  }

  public destroy(): void {
    this.iframe.remove();
  }
}
