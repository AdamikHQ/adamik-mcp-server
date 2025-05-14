/**
 * Manual MCP-like server for testing
 * This implements a simple request-response loop without the MCP library
 */
import readline from "readline";

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

// Simple tool handler for echo
function handleEchoTool(id: string, params: any) {
  console.error("DIRECT TEST: Echo tool called with message:", params.message);

  // Format response according to MCP protocol
  const response = {
    id,
    type: "tool_response",
    content: [
      {
        type: "text",
        text: `Echo: ${params.message}`,
      },
    ],
  };

  // Write to stdout
  console.error("DIRECT TEST: Sending response:", JSON.stringify(response));
  process.stdout.write(JSON.stringify(response) + "\n");
}

// Process each line from stdin
rl.on("line", (line) => {
  try {
    console.error(`DIRECT TEST: Received request: ${line}`);

    // Parse the request
    const request = JSON.parse(line);
    const { id, type, tool, params } = request;

    console.error(
      `DIRECT TEST: Parsed request - ID: ${id}, Type: ${type}, Tool: ${tool}`
    );

    // Handle the request based on the tool
    if (tool === "echo") {
      handleEchoTool(id, params);
    } else {
      // For other tools, just echo back a simple response
      const response = {
        id,
        type: "tool_response",
        content: [
          {
            type: "text",
            text: `Received request for tool: ${tool}`,
          },
        ],
      };

      console.error("DIRECT TEST: Sending generic response for non-echo tool");
      process.stdout.write(JSON.stringify(response) + "\n");
    }
  } catch (error) {
    console.error(`DIRECT TEST: Error processing request: ${error}`);
  }
});

console.error(
  "DIRECT TEST: Simple MCP-style server started. Waiting for requests..."
);
