// npm run cli -- <tool> '{"json":"args"}'   e.g.  npm run cli -- find_cars '{"city":"atlanta","target":40}'
import { openDb } from "../src/lib/db.ts";
import { tools, callTool } from "../src/lib/tools.ts";

const [name, raw] = process.argv.slice(2);
if (!name || !(name in tools)) {
  console.error(`Usage: cli <tool> [json]\nTools: ${Object.keys(tools).join(", ")}`);
  process.exit(1);
}
const result = await callTool(openDb(), name, raw ? JSON.parse(raw) : {});
console.log(JSON.stringify(result, null, 2));
