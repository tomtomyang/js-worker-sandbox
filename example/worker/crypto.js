addEventListener("fetch", (event) => {  
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const uuid = crypto.randomUUID();
  console.log(uuid);

  const random = crypto.getRandomValues(new Uint8Array(10));
  console.log(random);

  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("Hello World!"));
  console.log(hash);

  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  console.log(key);

  return new Response("Hello Crypto!")
}
