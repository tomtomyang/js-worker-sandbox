import { WorkerSandbox } from '../../../dist/broswer';

async function run() {
  const ws = new WorkerSandbox({
    script: `
addEventListener('fetch', event => {
  event.respondWith(handleRequest());
})

async function handleRequest() {
  setTimeout(() => {
    console.log('5 seconds have passed!');
  }, 5000);

  return new Response('Hello Timer!');
}
`,
  });
  
  const res = await ws.dispatchFetch("http://localhost:8000/");
  
  console.log(await res.text());
  ws.dispose();
}

run();
