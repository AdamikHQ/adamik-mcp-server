import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Config } from "../config";
import { StarknetSignature } from "../types";
import { ec } from "starknet";
import z from "zod";

/**
 * Register StarkNet related tools with the MCP server
 * Currently commented out as it's highly specific
 */
export function registerStarknetTools(server: McpServer, config: Config) {
  // StarkNet tool is commented out as it's highly specific for now
  /*
  server.tool(
    "sign-starknet-message",
    "Sign a message with a starknet wallet",
    {
      message: z.string().describe("The message to sign"),
    },
    async ({ message }) => {
      const starknetPrivateKey = config.STARKNET_PRIVATE_KEY;

      if (!starknetPrivateKey) {
        return {
          content: [
            {
              type: "text",
              text: "Error: STARKNET_PRIVATE_KEY is not set in configuration",
            },
          ],
        };
      }

      try {
        const signature = ec.starkCurve.sign(message, starknetPrivateKey);
        const signatureHex = signature.toDERHex();

        return {
          content: [{ type: "text", text: `Message signed: ${signatureHex}` }],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unknown error while signing message";

        return {
          content: [
            { type: "text", text: `Error signing message: ${errorMessage}` },
          ],
        };
      }
    }
  );
  */
}
