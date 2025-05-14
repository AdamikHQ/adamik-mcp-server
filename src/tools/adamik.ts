import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Config } from "../config";
import { AdamikApiClient } from "../api/client";
import { AdamikApiRequestOptions } from "../types";
import z from "zod";

/**
 * Add presentation hints based on the API path pattern
 */
function addPresentationHints(path: string, data: any): any {
  // Clone the data to avoid modifying the original
  const result = {
    data,
    presentation: {},
  };

  // Set default presentation
  result.presentation = {
    style: "default",
    highlights: [],
  };

  // Detect specific endpoint patterns
  if (path.includes("/balances")) {
    // Balance endpoints
    result.presentation = {
      style: "tabular",
      title: "Wallet Balance",
      description:
        "Present this as a nicely formatted table with token symbols and values.",
      highlights: ["totalValueUsd"],
      format:
        "Token balances should always show 4 decimal places for crypto assets.",
      sorting: "Sort tokens by value (highest first).",
    };
  } else if (path.includes("/transactions")) {
    // Transaction endpoints
    result.presentation = {
      style: "list",
      title: "Transaction History",
      description:
        "Present as a chronological list with the most recent transactions first.",
      timeFormat:
        "Convert timestamps to local readable time (e.g., 'June 1, 2023 at 2:30 PM').",
      highlights: ["recent"],
      grouping: "Group by day for better readability.",
    };
  } else if (path.includes("/rewards")) {
    // Staking rewards
    result.presentation = {
      style: "summary",
      title: "Staking Rewards",
      highlights: ["totalRewards", "annualPercentageRate"],
      charts: ["rewards_over_time"],
      recommendations: true,
    };
  } else if (path.includes("/validator")) {
    // Validator information
    result.presentation = {
      style: "profile",
      title: "Validator Profile",
      highlights: ["commission", "uptime", "votingPower"],
      showRank: true,
      metrics: "Show performance metrics prominently",
    };
  }

  return result;
}

/**
 * Register Adamik API related tools with the MCP server
 */
export function registerAdamikTools(
  server: McpServer,
  config: Config,
  apiClient: AdamikApiClient
) {
  // Simple echo tool for testing
  server.tool(
    "echo",
    "Echo back the input message (for testing)",
    {
      message: z.string().describe("Message to echo back"),
    },
    async ({ message }) => {
      console.error("ECHO TOOL CALLED with message:", message);

      return {
        content: [
          {
            type: "text",
            text: `Echo: ${message}`,
          },
        ],
      };
    }
  );

  // Tool to get Adamik documentation
  server.tool(
    "get-adamik-documentation",
    "Get the Adamik documentation",
    {},
    async () => {
      console.error("GET-ADAMIK-DOCUMENTATION TOOL CALLED");

      try {
        console.error(
          "Making API request to:",
          `${config.ADAMIK_API_BASE_URL}/api`
        );
        const response = await apiClient.get("api");
        console.error(
          "API response received:",
          response.success,
          "status:",
          response.status
        );

        if (!response.success) {
          console.error("API ERROR:", response.error);
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

        console.error("API SUCCESS - Returning response");
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response.data),
            },
          ],
        };
      } catch (error) {
        console.error("UNEXPECTED ERROR in get-adamik-documentation:", error);
        return {
          content: [
            {
              type: "text",
              text: `Unexpected error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );

  // Tool to call any Adamik API endpoint
  server.tool(
    "call-adamik-api",
    "Call one of the endpoints of the Adamik API. Response includes data and presentation hints for optimal rendering.",
    {
      path: z.string().describe("The path of the endpoint to call"),
      method: z.enum(["GET", "POST"]).describe("The HTTP method to use"),
      body: z
        .string()
        .optional()
        .describe("The request body for POST requests"),
    },
    async ({ path, method, body }: AdamikApiRequestOptions) => {
      console.error("CALL-ADAMIK-API TOOL CALLED:", { path, method });

      try {
        let response;

        if (method === "GET") {
          console.error(
            "Making GET request to:",
            `${config.ADAMIK_API_BASE_URL}/${path}`
          );
          response = await apiClient.get(path);
        } else {
          // Parse the body if it's a string
          let parsedBody;
          if (body) {
            try {
              parsedBody = JSON.parse(body);
              console.error("Parsed request body:", parsedBody);
            } catch (error) {
              console.error("Error parsing request body:", error);
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

          console.error(
            "Making POST request to:",
            `${config.ADAMIK_API_BASE_URL}/${path}`,
            "with body:",
            parsedBody
          );
          response = await apiClient.post(path, parsedBody);
        }

        console.error(
          "API response received:",
          response.success,
          "status:",
          response.status
        );
        if (!response.success) {
          console.error("API ERROR:", response.error);
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

        // Add presentation hints based on the endpoint pattern
        const enhancedResponse = addPresentationHints(path, response.data);

        console.error(
          "API SUCCESS - Returning enhanced response with presentation hints"
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(enhancedResponse),
            },
          ],
        };
      } catch (error) {
        console.error("UNEXPECTED ERROR in call-adamik-api:", error);
        return {
          content: [
            {
              type: "text",
              text: `Unexpected error: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}
