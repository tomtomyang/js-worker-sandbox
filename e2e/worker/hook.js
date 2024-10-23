;(function(){addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  return new Response(`Hello, Hook!`);
}
}(function(){if(addEventListener.__hooked){return;}// src/util/common.ts
function isUndefined(value) {
  return typeof value === "undefined";
}

// src/core/hooks.ts
var _HOOKS = (() => {
  const makeSyncFunctionHooked = /* @__PURE__ */ (() => {
    function makeSyncHooksRunner(hooks2) {
      return function(...args) {
        let final = args;
        for (let i = 0; i < hooks2.length; ++i) {
          const result = hooks2[i].apply(this, final);
          final = Array.isArray(result) && result?.length === args?.length ? result : args;
        }
        return final;
      };
    }
    function functionHooked(fn, h) {
      const beforeRunner = makeSyncHooksRunner(h.before);
      const afterRunner = makeSyncHooksRunner(h.after);
      const hooked = function(...args) {
        args = beforeRunner.apply(this, args);
        let result = fn.apply(this, args);
        result = afterRunner.apply(this, result);
        return result;
      };
      return hooked;
    }
    return functionHooked;
  })();
  const makeAsyncFunctionHooked = /* @__PURE__ */ (() => {
    function makeAsyncHooksRunner(hooks2) {
      return async function(...args) {
        let final = args;
        for (let i = 0; i < hooks2.length; ++i) {
          const result = await hooks2[i].apply(this, final);
          final = Array.isArray(result) && result?.length === args?.length ? result : args;
        }
        return final;
      };
    }
    function functionHooked(fn, h) {
      const beforeRunner = makeAsyncHooksRunner(h.before);
      const afterRunner = makeAsyncHooksRunner(h.after);
      const hooked = async function(...args) {
        args = await beforeRunner.apply(this, args);
        let result = await fn.apply(this, args);
        result = await afterRunner.apply(this, result);
        return result;
      };
      return hooked;
    }
    return functionHooked;
  })();
  function makeHook(makeFunctionHooked) {
    const before = [];
    const after = [];
    const hooked = (fn) => makeFunctionHooked(fn, { before, after });
    return { hooked, before, after };
  }
  const hooks = {
    addEventListener: {
      ...makeHook(makeSyncFunctionHooked)
    },
    fetchListener: {
      ...makeHook(makeSyncFunctionHooked)
    },
    event: {
      respondWith: {
        ...makeHook(makeSyncFunctionHooked)
      }
    },
    fetch: {
      ...makeHook(makeAsyncFunctionHooked)
    },
    crypto: {
      subtle: {
        encrypt: {
          ...makeHook(makeAsyncFunctionHooked)
        },
        decrypt: {
          ...makeHook(makeAsyncFunctionHooked)
        }
      }
    }
  };
  globalThis.addEventListener = hooks.addEventListener.hooked(addEventListener);
  if (isUndefined(addEventListener?.__hooked)) {
    Object.defineProperty(addEventListener, "__hooked", {
      value: true,
      writable: true,
      enumerable: false,
      configurable: false
    });
  } else {
    addEventListener.__hooked = true;
  }
  hooks.addEventListener.before.push((type, listener) => {
    if (type === "fetch") {
      return [type, hooks.fetchListener.hooked(listener)];
    }
    return [type, listener];
  });
  hooks.fetchListener.before.push((event) => {
    event.respondWith = hooks.event.respondWith.hooked(event.respondWith);
    return [event];
  });
  globalThis.fetch = hooks.fetch.hooked(fetch);
  globalThis.crypto.subtle.decrypt = hooks.crypto.subtle.decrypt.hooked(
    crypto.subtle.decrypt
  );
  globalThis.crypto.subtle.encrypt = hooks.crypto.subtle.decrypt.hooked(
    crypto.subtle.encrypt
  );
  Object.freeze(hooks);
  return hooks;
})();
var hooks_default = _HOOKS;

// src/hook/crypto.ts
hooks_default.crypto.subtle.encrypt.before.push(() => {
});

// src/hook/console.ts
hooks_default.fetchListener.before.push(() => {
});

// src/hook/fetch.ts
hooks_default.fetch.before.push(() => {
});

// src/hook/respondwith.ts
hooks_default.event.respondWith.before.push((response) => {
  (async () => {
    if (response instanceof Promise) {
      response = await response;
    }
    if (!response || !response.headers) {
      return;
    }
  })();
});
}()));