addEventListener("fetch", (event) => {
  const uuid = crypto.randomUUID();
  console.log(uuid);
  
  event.respondWith(new Response("Hello WorkerSandbox!"));
});
