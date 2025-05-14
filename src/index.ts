import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config";
import { AdamikApiClient } from "./api/client";
import { registerAllTools } from "./tools";

/**
 * Main entry point for the Adamik MCP Server
 */
async function main() {
  try {
    // Load and validate configuration
    const config = loadConfig();

    // Create API client
    const apiClient = new AdamikApiClient(
      config.ADAMIK_API_BASE_URL,
      config.ADAMIK_API_KEY
    );

    // Create server instance
    const server = new McpServer({
      name: "adamik-mcp-server",
      version: "0.0.1",
    });

    // Add debug logging
    console.error("Creating MCP Server instance");

    // Register all tools
    registerAllTools(server, config, apiClient);

    // Connect to stdio transport
    console.error("Setting up MCP transport...");
    const transport = new StdioServerTransport();

    // Add debug for stdin/stdout
    process.stdin.on("data", (data) => {
      console.error("STDIN RECEIVED:", data.toString().trim());
    });

    await server.connect(transport);
    console.error("Adamik MCP Server running on stdio");
  } catch (error) {
    console.error("Fatal error in main():", error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  console.error("Unhandled exception:", error);
  process.exit(1);
});
