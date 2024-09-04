# 构建一个 JS 执行沙箱


Node.js 的 `vm` 模块允许我们在 V8 的上下文中编译和运行代码，这为代码执行提供了一个隔离的环境，也就是所谓的“沙箱”。在进行指定代码的安全研究或测试时，经常需要评估代码片段的行为而不希望其对主系统造成影响。`vm` 模块恰好提供了这样的理想环境，用于观察和分析代码行为。

## 概述


本项目就是利用 `vm` 模块来创建一个 JavaScript 执行沙箱，实现了以下特性：

- 代码隔离：使用 Node.js 的 `vm` 模块在隔离的上下文中执行代码；

- 事件驱动：模拟浏览器的事件处理机制，如 `fetch` 事件；
- 调试支持：沙箱环境中包含 `console` 对象，便于开发者调试；


## 使用

```js
import { TomtomSandbox } from "../src/core.js";

const tts = new TomtomSandbox({
  script: `
addEventListener("fetch", (event) => {
  console.log(event.request.url);
  event.respondWith(new Response("Hello TomtomSandbox!"));
});`,
});

const res = await tts.dispatchFetch("http://localhost:8000/");
console.log(await res.text());
await tts.dispose();

```


## API

### `TomtomSandbox`

- **构造函数**：接受一个配置对象，其中 `script` 是要在沙箱中执行的 JavaScript 代码；
- **dispatchFetch(url)**：模拟一个 `fetch` 事件，触发事件监听器；
- **dispose()**：清除所有事件监听器，释放资源；

