import { WorkerSandbox } from "../src/core.js";

const ws = new WorkerSandbox({
  script: `
addEventListener("fetch", async (event) => {
  const res = await fetch("https://baidu.com");
  console.log(res.status);
  console.log(await res.text());
  
  event.respondWith(new Response("Hello WorkerSandbox!"));
});`,
});

const res = await ws.dispatchFetch("http://localhost:8000/");
console.log(await res.text());
await ws.dispose();
