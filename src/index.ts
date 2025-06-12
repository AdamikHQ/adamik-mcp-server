#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import AdamikMCPServer from './module.js';

const ADAMIK_API_KEY = process.env.ADAMIK_API_KEY ?? 'no-api-key';
const ADAMIK_API_BASE_URL = process.env.ADAMIK_API_BASE_URL ?? 'https://api.adamik.io/api';

async function main() {
  const server = AdamikMCPServer({
    config: {
      adamikApiKey: ADAMIK_API_KEY,
      adamikApiBaseUrl: ADAMIK_API_BASE_URL,
    }
  });
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
