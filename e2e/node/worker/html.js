addEventListener('fetch', event => {
  event.respondWith(handleRequest());
})

async function handleRequest() {
  return new Response(`
<!DOCTYPE html>
<html>
  <head>
    <title>Hello, HTML!</title>
  </head>
  <body>
    <h1>Hello, HTML!</h1>
  </body>
</html>
  `, {
    headers: {
      'Content-Type': 'text/html'
    }
  })
}
