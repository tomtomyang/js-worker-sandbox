import path from "path";
import { WorkerSandbox } from "../../dist/index.js";

async function run() {
  const ws = new WorkerSandbox({
    scriptPath: path.resolve(__dirname, "./worker/stream.js"),
  });
  
  const res = await ws.dispatchFetch("http://localhost:8000/");
  
  console.log(await res.text());
  ws.dispose();
}

run();