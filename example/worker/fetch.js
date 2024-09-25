addEventListener("fetch", async (event) => {
  const res = await fetch("https://google.com");
  console.log(res.status);
  console.log(await res.text());
  
  event.respondWith(new Response("Hello WorkerSandbox!"));
});
