# 轻量 JS Worker 执行沙箱

[English](README.md) | [简体中文](README.zh-CN.md)

Node.js 的 `vm` 模块允许我们在 V8 的上下文中编译和运行代码，这为代码执行提供了一个隔离的环境，也就是所谓的“沙箱”。在进行指定代码的安全研究或测试时，经常需要评估代码片段的行为而不希望其对主系统造成影响。`vm` 模块恰好提供了这样的理想环境，可以用于观察和分析代码行为。

## 概述

本项目使用 `vm` 模块来创建一个 JavaScript Worker 执行沙箱，实现了以下特性：

- 代码隔离：使用 Node.js 的 `vm` 模块在隔离的上下文中执行代码；
- 事件驱动：实现 Worker 的 `fetch` 事件处理机制；
- 环境模拟：模拟 Worker Runtime 的各类 API；
- 调试支持：支持 `console` 数据打印，便于开发调试；

## 安装

```shell
npm i js-worker-sandbox -D
```


## 使用

### Node.js

```js
const { WorkerSandbox } = require("js-worker-sandbox");

async function run() {
  const ws = new WorkerSandbox({
    script: `
addEventListener("fetch", (event) => {
  console.log(event.request.url);
  event.respondWith(new Response("Hello WorkerSandbox!"));
});`,
  });
  
  const res = await ws.dispatchFetch("http://localhost:8000/");
  
  console.log(await res.text());
  ws.dispose();
}

run();
```

```ts
const { WorkerSandbox } = require("js-worker-sandbox");

async function run() {
  const ws = new WorkerSandbox({
    script: `
addEventListener("fetch", (event) => {
  console.log(event.request.url);
  event.respondWith(new Response("Hello WorkerSandbox!"));
});`,
  });
  
  const res = await ws.dispatchFetch("http://localhost:8000/");
  
  console.log(await res.text());
  ws.dispose();
}

run();
```

### Browser

```js
import { WorkerSandbox } from "js-worker-sandbox/broswer";

async function run() {
  const ws = new WorkerSandbox({
    script: `
addEventListener("fetch", (event) => {
  console.log(event.request.url);
  event.respondWith(new Response("Hello WorkerSandbox!"));
});`,
  });
  
  const res = await ws.dispatchFetch("http://localhost:8000/");
  
  console.log(await res.text());
  ws.dispose();
}

run();
```

```ts
import { WorkerSandbox } from "js-worker-sandbox/broswer";

async function run() {
  const ws = new WorkerSandbox({
    script: `
addEventListener("fetch", (event) => {
  console.log(event.request.url);
  event.respondWith(new Response("Hello WorkerSandbox!"));
});`,
  });
  
  const res = await ws.dispatchFetch("http://localhost:8000/");
  
  console.log(await res.text());
  ws.dispose();
}

run();
```

## API

### `WorkerSandbox`

- **constructor(init)**：接受一个配置对象，其中 `script` 是需要执行的 JavaScript 代码；
- **dispatchFetch(url, requestInit)**：模拟 `fetch` 事件，触发事件监听器；
- **dispose()**：清除所有事件监听器，释放资源；

