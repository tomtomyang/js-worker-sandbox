import path from "path";
import { fileURLToPath } from 'url';

import { WorkerSandBox } from "../src/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ws = new WorkerSandBox({
  scriptPath: path.resolve(__dirname, "./worker/fetch.js"),
});

const res = await ws.dispatchFetch("http://localhost:8000/");

console.log(await res.text());
await ws.dispose();
