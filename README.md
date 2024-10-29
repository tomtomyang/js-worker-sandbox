# Lightweight JS Worker Execution Sandbox

[English](README.md) | [简体中文](README.zh-CN.md)

Node.js's `vm` module allows us to compile and run code within V8 contexts, providing an isolated environment for code execution, also known as a "sandbox". When conducting security research or testing specific code, it's often necessary to evaluate code snippets' behavior without affecting the main system. The `vm` module provides an ideal environment for observing and analyzing code behavior.

> Note: Since version 3.0.0, WorkerSandbox supports browser environment. This feature is still experimental and currently implemented based on `iframe`.

## Overview

This project uses the `vm` module to create a JavaScript Worker execution sandbox, implementing the following features:

- Code isolation: Execute code in an isolated context using Node.js's `vm` module;
- Event-driven: Implement the Worker's `fetch` event handling mechanism;
- Environment simulation: Simulate various APIs of the Worker Runtime;
- Debugging support: Support `console` data printing for development and debugging;

## Installation

```shell
npm i js-worker-sandbox -D
```

## Usage

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
import { WorkerSandbox } from "js-worker-sandbox/dist/broswer";

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
import { WorkerSandbox } from "js-worker-sandbox/dist/broswer";

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

- **constructor(init)**: Accepts a configuration object where `script` is the JavaScript code to be executed;
- **dispatchFetch(url, requestInit)**: Simulates a `fetch` event, triggering event listeners;
- **dispose()**: Clears all event listeners and releases resources;