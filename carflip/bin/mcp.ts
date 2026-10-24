// Headless CarFlip over MCP (stdio). Add to an MCP client as:
//   { "command": "node", "args": ["--experimental-strip-types", "<path>/carflip/bin/mcp.ts"],
//     "env": { "APIFY_TOKEN": "...", "OPENROUTER_API_KEY": "...", "CARFLIP_DB": "<path>/carflip.db" } }
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { openDb } from "../src/lib/db.ts";
import { tools, callTool } from "../src/lib/tools.ts";

const db = openDb();
const server = new McpServer({ name: "carflip", version: "0.1.0" });

for (const [name, t] of Object.entries(tools)) {
  server.registerTool(name, { description: t.description, inputSchema: t.input as any }, async (args: unknown) => {
    try {
      const result = await callTool(db, name, args);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    } catch (e) {
      return { isError: true, content: [{ type: "text" as const, text: (e as Error).message }] };
    }
  });
}

await server.connect(new StdioServerTransport());
