async function sleep() {
  console.log('sleep');
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('sleep done');
      resolve();
    }, 3000);
  });
}
async function streamHTMLContent(writable) {
  const writer = writable.getWriter();

  console.log('start');

  await writer.write(new TextEncoder().encode('<div>First segment</div>'));
  console.log('first done');

  await sleep();

  await writer.write(new TextEncoder().encode('<div>Second segment</div>'));
  console.log('second done');

  await writer.close();
}

async function handleEvent(event) {
  const { readable, writable } = new TransformStream();

  streamHTMLContent(writable);

  const res = new Response(readable, {
    headers: { 'Content-Type': 'text/html' },
  });

  event.respondWith(res);
}

addEventListener('fetch', event => {
  handleEvent(event);
});
