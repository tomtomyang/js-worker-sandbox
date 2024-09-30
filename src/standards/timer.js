import { setTimeout, clearTimeout, setInterval, clearInterval } from 'node:timers';

const setTimeoutProxy = new Proxy(setTimeout, {
  apply: (target, thisArg, args) => {
    const timeout = Reflect.apply(target, thisArg, args)
    return timeout[Symbol.toPrimitive]()
  },
})

const setIntervalProxy = new Proxy(setInterval, {
  apply: (target, thisArg, args) => {
    const timeout = Reflect.apply(target, thisArg, args)
    return timeout[Symbol.toPrimitive]()
  },
})

const clearTimeoutProxy = new Proxy(clearTimeout, {
  apply: (target, thisArg, args) => {
    const timeout = Reflect.apply(target, thisArg, args)
    return timeout[Symbol.toPrimitive]()
  },
})

const clearIntervalProxy = new Proxy(clearInterval, {
  apply: (target, thisArg, args) => {
    const timeout = Reflect.apply(target, thisArg, args)
    return timeout[Symbol.toPrimitive]()
  },
})



export { setTimeoutProxy as setTimeout, setIntervalProxy as setInterval, clearTimeoutProxy as clearTimeout, clearIntervalProxy as clearInterval };
