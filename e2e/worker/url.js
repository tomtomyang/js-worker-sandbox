addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);

  const params = new URLSearchParams(url.search);

  const name = params.get('name');
  console.log(name);

  params.set('hello', 'world');

  url.pathname = '/test/';
  url.search = params.toString();

  return new Response(url.toString());
}
