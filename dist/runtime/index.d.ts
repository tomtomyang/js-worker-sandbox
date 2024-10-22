import * as header from './header';
import * as request from './request';
import * as response from './response';
import * as url from './url';
import * as encoder from './encoder';
import * as stream from './stream';
import * as fetch from './fetch';
declare const _default: {
    Blob: any;
    fetch: typeof fetch.fetch;
    ReadableStream: {
        new (underlyingSource: import("stream/web").UnderlyingByteSource, strategy?: import("stream/web").QueuingStrategy<Uint8Array>): stream.ReadableStream<Uint8Array>;
        new <R = any>(underlyingSource?: import("stream/web").UnderlyingSource<R>, strategy?: import("stream/web").QueuingStrategy<R>): stream.ReadableStream<R>;
        prototype: stream.ReadableStream;
        from<T>(iterable: Iterable<T> | AsyncIterable<T>): stream.ReadableStream<T>;
    };
    WritableStream: {
        new <W = any>(underlyingSink?: import("stream/web").UnderlyingSink<W>, strategy?: import("stream/web").QueuingStrategy<W>): stream.WritableStream<W>;
        prototype: stream.WritableStream;
    };
    TransformStream: {
        new <I = any, O = any>(transformer?: import("stream/web").Transformer<I, O>, writableStrategy?: import("stream/web").QueuingStrategy<I>, readableStrategy?: import("stream/web").QueuingStrategy<O>): stream.TransformStream<I, O>;
        prototype: stream.TransformStream;
    };
    ReadableStreamBYOBReader: {
        new (stream: stream.ReadableStream): stream.ReadableStreamBYOBReader;
        prototype: stream.ReadableStreamBYOBReader;
    };
    ReadableStreamDefaultReader: {
        new <R = any>(stream: stream.ReadableStream<R>): stream.ReadableStreamDefaultReader<R>;
        prototype: stream.ReadableStreamDefaultReader;
    };
    TextDecoderStream: {
        new (encoding?: string, options?: import("stream/web").TextDecoderOptions): stream.TextDecoderStream;
        prototype: stream.TextDecoderStream;
    };
    TextEncoderStream: {
        new (): stream.TextEncoderStream;
        prototype: stream.TextEncoderStream;
    };
    WritableStreamDefaultWriter: {
        new <W = any>(stream: stream.WritableStream<W>): stream.WritableStreamDefaultWriter<W>;
        prototype: stream.WritableStreamDefaultWriter;
    };
    setTimeout: typeof setTimeout;
    setInterval: typeof setInterval;
    clearTimeout: typeof clearTimeout;
    clearInterval: typeof clearInterval;
    TextEncoder: typeof encoder.TextEncoder;
    TextDecoder: typeof encoder.TextDecoder;
    URL: typeof url.URL;
    URLSearchParams: typeof url.URLSearchParams;
    URLPattern: typeof url.URLPattern;
    crypto: import("crypto").webcrypto.Crypto;
    Response: typeof response.Response;
    Request: typeof request.Request;
    Headers: typeof header.Headers;
};
export default _default;
