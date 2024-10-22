"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearInterval = exports.clearTimeout = exports.setInterval = exports.setTimeout = void 0;
const node_timers_1 = require("node:timers");
const setTimeoutProxy = new Proxy(node_timers_1.setTimeout, {
    apply: (target, thisArg, args) => {
        const timeout = Reflect.apply(target, thisArg, args);
        return timeout[Symbol.toPrimitive]();
    },
});
exports.setTimeout = setTimeoutProxy;
const setIntervalProxy = new Proxy(node_timers_1.setInterval, {
    apply: (target, thisArg, args) => {
        const timeout = Reflect.apply(target, thisArg, args);
        return timeout[Symbol.toPrimitive]();
    },
});
exports.setInterval = setIntervalProxy;
const clearTimeoutProxy = new Proxy(node_timers_1.clearTimeout, {
    apply: (target, thisArg, args) => {
        const timeout = Reflect.apply(target, thisArg, args);
        return timeout[Symbol.toPrimitive]();
    },
});
exports.clearTimeout = clearTimeoutProxy;
const clearIntervalProxy = new Proxy(node_timers_1.clearInterval, {
    apply: (target, thisArg, args) => {
        const timeout = Reflect.apply(target, thisArg, args);
        return timeout[Symbol.toPrimitive]();
    },
});
exports.clearInterval = clearIntervalProxy;
