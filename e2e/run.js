const path = require("path");

const { WorkerSandBox } = require("../dist/index.js");

async function run() {
  const ws = new WorkerSandBox({
    scriptPath: path.resolve(__dirname, "./worker/react.js"),
  });
  
  const res = await ws.dispatchFetch("http://localhost:8000/");
  
  console.log(await res.text());
  await ws.dispose();
}

run();
