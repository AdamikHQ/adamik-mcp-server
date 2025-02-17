import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ec } from "starknet";
import z from "zod";

const API_BASE = process.env.ADAMIK_API_BASE!;

// Create server instance
const server = new McpServer({
  name: "adamik-ai",
  version: "0.0.1",
});

// Helper function for making NWS API requests
async function makeApiRequest<T>(
  url: string,
  method: "GET" | "POST",
  body?: any
): Promise<T | null> {
  const headers = {
    Accept: "application/json",
    Authorization: process.env.ADAMIK_API_KEY!,
  };

  try {
    const response = await fetch(url, { headers, body, method });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making NWS request:", error);
    return null;
  }
}

server.tool(
  "sign-starknet-message",
  "Sign a message with a starknet wallet",
  {
    message: z.string().describe("The message to sign"),
  },
  async ({ message }) => {
    const starknetPrivateKey = process.env.STARKNET_PRIVATE_KEY;

    if (!starknetPrivateKey) {
      throw new Error("STARKNET_PRIVATE_KEY is not set");
    }

    const signature = ec.starkCurve.sign(message, starknetPrivateKey);

    return {
      content: [
        { type: "text", text: `Message signed: ${signature.toDERHex()}` },
      ],
    };
  }
);

server.tool(
  "get-adamik-documentation",
  "Get the Adamik documentation",
  {},
  async () => {
    const documentation = await makeApiRequest(`${API_BASE}/api`, "GET");

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(documentation),
        },
      ],
    };
  }
);

server.tool(
  "call-adamik-api",
  "Call one of the get endpoint of the Adamik API",
  {
    path: z.string().describe("The path of the endpoint to call"),
    method: z.enum(["GET", "POST"]),
    body: z.string().optional(),
  },
  async ({
    path,
    method,
    body,
  }: {
    path: string;
    method: "GET" | "POST";
    body?: string;
  }) => {
    const documentation = await makeApiRequest(
      `${API_BASE}/${path}`,
      method,
      body
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(documentation),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Adamik MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
