const path = require("path");
const { WorkerSandbox } = require("../dist/index.js");

async function run() {
  const ws = new WorkerSandbox({
    scriptPath: path.resolve(__dirname, "./worker/react.js"),
  });
  
  const res = await ws.dispatchFetch("http://localhost:8000/");
  
  console.log(await res.text());
  ws.dispose();
}

run();
