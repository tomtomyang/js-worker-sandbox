"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerVM = void 0;
const vm_1 = require("vm");
const events_1 = require("events");
const index_js_1 = __importDefault(require("../runtime/index.js"));
class WorkerVM {
    script;
    eventEmitter;
    context;
    constructor({ script = '' }) {
        this.script = script;
        this.eventEmitter = this.initEmmitter();
        this.context = this.initContext();
        this.initScript();
    }
    initEmmitter() {
        return new events_1.EventEmitter();
    }
    initContext() {
        const addEventListener = (type, listener) => {
            if (!this.eventEmitter) {
                throw new Error('Event emitter not initialized');
            }
            this.eventEmitter.on(type, listener);
        };
        return (0, vm_1.createContext)({
            ...(index_js_1.default || {}),
            console,
            addEventListener: addEventListener.bind(this),
        }, {
            name: 'JS Worker Sandbox',
            codeGeneration: {
                strings: false,
                wasm: true,
            },
        });
    }
    initScript() {
        if (!this.script || !this.context) {
            throw new Error('Script or context not initialized');
        }
        const vmScript = new vm_1.Script(this.script);
        vmScript.runInContext(this.context, {
            timeout: 5000,
            displayErrors: true,
        });
    }
    dispatchFetch(url, requestInit) {
        const request = new index_js_1.default.Request(url, requestInit);
        const response = new Promise((resolve, reject) => {
            const event = {
                request,
                respondWith: (response) => {
                    if (response instanceof index_js_1.default.Response) {
                        resolve(response);
                    }
                    else if (typeof response?.then === 'function') {
                        response.then((fulfilled) => {
                            if (fulfilled instanceof index_js_1.default.Response) {
                                resolve(fulfilled);
                            }
                            else {
                                reject(new Error('Invalid response'));
                            }
                        }).catch(reject);
                    }
                    else {
                        reject(new Error('Invalid response'));
                    }
                },
                waitUntil: (promise) => {
                    promise.then(() => { }).catch(console.error);
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
exports.WorkerVM = WorkerVM;
