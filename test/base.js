import { WorkerSandbox } from "../src/core.js";

const tts = new WorkerSandbox({
  script: `
addEventListener("fetch", (event) => {
  console.log(event.request.url);
  event.respondWith(new Response("Hello WorkerSandbox!"));
});`,
});

const res = await tts.dispatchFetch("http://localhost:8000/");
console.log(await res.text());
await tts.dispose();
