addEventListener("fetch", (event) => {
  console.log(event.request.url);
  event.respondWith(new Response("Hello WorkerSandbox!"));
});
