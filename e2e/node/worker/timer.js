addEventListener('fetch', event => {
  event.respondWith(handleRequest());
})

async function handleRequest() {
  setTimeout(() => {
    console.log('5 seconds have passed!');
  }, 5000);

  return new Response('Hello Timer!');
}
