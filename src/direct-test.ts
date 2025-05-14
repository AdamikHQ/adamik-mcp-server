/**
 * Manual MCP-like server for testing
 * This is a simplified implementation of the MCP protocol for testing purposes
 * that bypasses the official MCP library
 */
import readline from "readline";
import axios from "axios";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
const envPath = resolve(__dirname, "../.env");
console.error("Loading .env file from:", envPath);
config({ path: envPath });

const ADAMIK_API_BASE_URL = process.env.ADAMIK_API_BASE_URL!;
const ADAMIK_API_KEY = process.env.ADAMIK_API_KEY!;

if (!ADAMIK_API_BASE_URL || !ADAMIK_API_KEY) {
  console.error(
    "Error: ADAMIK_API_BASE_URL and ADAMIK_API_KEY environment variables must be set"
  );
  process.exit(1);
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

// Simple helper for making API requests
async function makeApiRequest<T>(
  path: string,
  method: "GET" | "POST",
  body?: any
): Promise<any> {
  console.error(
    `DIRECT TEST: Making ${method} request to ${ADAMIK_API_BASE_URL}/${path}`
  );
  try {
    const response = await axios({
      url: `${ADAMIK_API_BASE_URL}/${path}`,
      method,
      headers: {
        Accept: "application/json",
        Authorization: ADAMIK_API_KEY,
        "Content-Type": "application/json",
        "User-Agent": "Adamik MCP Server (Direct Test)",
      },
      data: body,
      timeout: 10000,
    });

    console.error(
      "DIRECT TEST: API request succeeded with status",
      response.status
    );
    return response.data;
  } catch (error: any) {
    console.error("DIRECT TEST: API request failed:", error.message);
    if (error.response) {
      console.error("DIRECT TEST: API response status:", error.response.status);
      console.error("DIRECT TEST: API response data:", error.response.data);
    }
    throw error;
  }
}

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

// Handler for get-adamik-documentation
async function handleGetDocumentation(id: string) {
  console.error("DIRECT TEST: Get documentation tool called");

  try {
    const data = await makeApiRequest("api", "GET");

    const response = {
      id,
      type: "tool_response",
      content: [
        {
          type: "text",
          text: JSON.stringify(data),
        },
      ],
    };

    console.error("DIRECT TEST: Sending documentation response");
    process.stdout.write(JSON.stringify(response) + "\n");
  } catch (error) {
    const errorResponse = {
      id,
      type: "tool_response",
      content: [
        {
          type: "text",
          text: `Error getting documentation: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
    };

    console.error(
      "DIRECT TEST: Sending error response for documentation request"
    );
    process.stdout.write(JSON.stringify(errorResponse) + "\n");
  }
}

// Handler for call-adamik-api
async function handleApiCall(id: string, params: any) {
  console.error("DIRECT TEST: API call tool called with params:", params);
  const { path, method, body } = params;

  try {
    let parsedBody;
    if (body && typeof body === "string") {
      try {
        parsedBody = JSON.parse(body);
        console.error("DIRECT TEST: Parsed body:", parsedBody);
      } catch (error) {
        const errorResponse = {
          id,
          type: "tool_response",
          content: [
            {
              type: "text",
              text: `Error parsing request body: ${
                error instanceof Error ? error.message : "Invalid JSON"
              }`,
            },
          ],
        };

        console.error("DIRECT TEST: Sending error response for invalid JSON");
        process.stdout.write(JSON.stringify(errorResponse) + "\n");
        return;
      }
    }

    const data = await makeApiRequest(path, method, parsedBody);

    const response = {
      id,
      type: "tool_response",
      content: [
        {
          type: "text",
          text: JSON.stringify(data),
        },
      ],
    };

    console.error("DIRECT TEST: Sending API call response");
    process.stdout.write(JSON.stringify(response) + "\n");
  } catch (error) {
    const errorResponse = {
      id,
      type: "tool_response",
      content: [
        {
          type: "text",
          text: `Error calling API: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
    };

    console.error("DIRECT TEST: Sending error response for API call");
    process.stdout.write(JSON.stringify(errorResponse) + "\n");
  }
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
    } else if (tool === "get-adamik-documentation") {
      handleGetDocumentation(id);
    } else if (tool === "call-adamik-api") {
      handleApiCall(id, params);
    } else {
      // For unknown tools, send a generic response
      const response = {
        id,
        type: "tool_response",
        content: [
          {
            type: "text",
            text: `Unknown tool: ${tool}`,
          },
        ],
      };

      console.error("DIRECT TEST: Sending response for unknown tool");
      process.stdout.write(JSON.stringify(response) + "\n");
    }
  } catch (error) {
    console.error(`DIRECT TEST: Error processing request: ${error}`);

    // Try to send an error response if we can parse the ID
    try {
      const { id } = JSON.parse(line);
      if (id) {
        const errorResponse = {
          id,
          type: "tool_response",
          content: [
            {
              type: "text",
              text: `Error processing request: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };

        process.stdout.write(JSON.stringify(errorResponse) + "\n");
      }
    } catch {
      // Can't even parse the request ID, so can't send a proper error response
      console.error(
        "DIRECT TEST: Couldn't parse request to get ID for error response"
      );
    }
  }
});

console.error(
  "DIRECT TEST: Simple MCP-style server started. Waiting for requests..."
);
