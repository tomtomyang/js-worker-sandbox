import { WorkerSandbox } from "../src/core.js";

const ws = new WorkerSandbox({
  script: `
addEventListener("fetch", (event) => {
  const uuid = crypto.randomUUID();
  console.log(uuid);
  
  event.respondWith(new Response("Hello WorkerSandbox!"));
});`,
});

const res = await ws.dispatchFetch("http://localhost:8000/");
console.log(await res.text());
await ws.dispose();
