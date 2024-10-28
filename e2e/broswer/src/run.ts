import { WorkerSandbox } from '../../../dist/broswer';

const ws = new WorkerSandbox({
  script: `addEventListener("fetch", (event) => {
    console.log(event.request.url);
    event.respondWith(new Response("Hello WorkerSandbox!"));
  });`,
});

ws.dispatchFetch('http://localhost:8000/').then((res) => {
  res.text().then((text) => console.log(text));
});
