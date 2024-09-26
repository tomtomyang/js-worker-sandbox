import path from "path";
import { fileURLToPath } from 'url';

import { WorkerSandbox } from "../src/core.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ws = new WorkerSandbox({
  scriptPath: path.resolve(__dirname, "./worker/stream.js"),
});

const res = await ws.dispatchFetch("http://localhost:8000/");

console.log(await res.text());
await ws.dispose();
