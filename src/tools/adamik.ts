import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Config } from "../config";
import { AdamikApiClient } from "../api/client";
import { AdamikApiRequestOptions } from "../types";
import z from "zod";

/**
 * Register Adamik API related tools with the MCP server
 */
export function registerAdamikTools(
  server: McpServer,
  config: Config,
  apiClient: AdamikApiClient
) {
  // Tool to get Adamik documentation
  server.tool(
    "get-adamik-documentation",
    "Get the Adamik documentation",
    {},
    async () => {
      const response = await apiClient.get("api");

      if (!response.success) {
        return {
          content: [
            {
              type: "text",
              text: `Error getting Adamik documentation: ${
                response.error || "Unknown error"
              }`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data),
          },
        ],
      };
    }
  );

  // Tool to call any Adamik API endpoint
  server.tool(
    "call-adamik-api",
    "Call one of the endpoints of the Adamik API",
    {
      path: z.string().describe("The path of the endpoint to call"),
      method: z.enum(["GET", "POST"]).describe("The HTTP method to use"),
      body: z
        .string()
        .optional()
        .describe("The request body for POST requests"),
    },
    async ({ path, method, body }: AdamikApiRequestOptions) => {
      let response;

      if (method === "GET") {
        response = await apiClient.get(path);
      } else {
        // Parse the body if it's a string
        let parsedBody;
        if (body) {
          try {
            parsedBody = JSON.parse(body);
          } catch (error) {
            return {
              content: [
                {
                  type: "text",
                  text: `Error parsing request body: ${
                    error instanceof Error ? error.message : "Invalid JSON"
                  }`,
                },
              ],
            };
          }
        }

        response = await apiClient.post(path, parsedBody);
      }

      if (!response.success) {
        return {
          content: [
            {
              type: "text",
              text: `Error calling Adamik API: ${
                response.error || "Unknown error"
              }`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data),
          },
        ],
      };
    }
  );
}
