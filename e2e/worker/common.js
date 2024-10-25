addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const json = JSON.stringify(request.url);
  console.log(json)

  const math = Math.random();
  console.log(math)

  const object = Object.keys(request);
  console.log(object)

  return new Response('Hello JSON!');
}
