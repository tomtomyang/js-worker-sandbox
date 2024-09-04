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
