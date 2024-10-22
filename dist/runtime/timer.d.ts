declare const setTimeoutProxy: typeof globalThis.setTimeout;
declare const setIntervalProxy: typeof globalThis.setInterval;
declare const clearTimeoutProxy: typeof globalThis.clearTimeout;
declare const clearIntervalProxy: typeof globalThis.clearInterval;
export { setTimeoutProxy as setTimeout, setIntervalProxy as setInterval, clearTimeoutProxy as clearTimeout, clearIntervalProxy as clearInterval };
