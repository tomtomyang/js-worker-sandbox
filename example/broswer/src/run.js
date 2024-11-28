import { WorkerSandbox } from '../../../dist/broswer';

async function run() {
  const ws = new WorkerSandbox({
    script: `
addEventListener("fetch", async (event) => {
  const res = await fetch("https://google.com");

  console.log(res.status);
  console.log(await res.text());
  
  event.respondWith(new Response("Hello Fetch!"));
});
`,
  });
  
  const res = await ws.dispatchFetch("http://localhost:8000/");
  
  console.log(await res.text());
  ws.dispose();
}

run();