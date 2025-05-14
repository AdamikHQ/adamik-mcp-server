import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Config } from "../config";
import { AdamikApiClient } from "../api/client";
import { registerStarknetTools } from "./starknet";
import { registerAdamikTools } from "./adamik";

/**
 * Register all tools with the MCP server
 */
export function registerAllTools(
  server: McpServer,
  config: Config,
  apiClient: AdamikApiClient
) {
  // Register StarkNet tools - currently commented out in implementation as it's highly specific
  registerStarknetTools(server, config);

  // Register Adamik API tools
  registerAdamikTools(server, config, apiClient);

  console.error("All tools registered successfully");
}
