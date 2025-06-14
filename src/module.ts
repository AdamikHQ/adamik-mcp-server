import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Adamik MCP Server - Tool Implementation
 *
 * Architecture documentation: TOOLS_ARCHITECTURE.md
 */

import z from "zod";
import chains from "./chains.js";
import {
  BroadcastTransactionPathParams,
  BroadcastTransactionRequestBody,
  BroadcastTransactionRequestBodySchema,
  BroadcastTransactionResponse,
  ChainIdSchema,
  EncodeTransactionPathParams,
  EncodeTransactionRequestBody,
  EncodeTransactionRequestBodySchema,
  EncodeTransactionResponse,
  GetAccountHistoryPathParams,
  GetAccountHistoryQueryParams,
  GetAccountHistoryResponse,
  GetAccountStatePathParams,
  GetAccountStateResponse,
  GetChainDetailsResponse,
  GetChainValidatorsPathParams,
  GetChainValidatorsQueryParams,
  GetChainValidatorsResponse,
  GetTokenDetailsResponse,
  GetTransactionDetailsPathParams,
  GetTransactionDetailsResponse,
  PubkeyToAddressPathParams,
  PubkeyToAddressRequestBody,
  PubkeyToAddressResponse,
} from "./schemas.js";

type ApiError = {
  error: string;
};

// Helper function for making Adamik API requests
async function makeApiRequest<T>(
  url: string,
  apiKey: string,
  method: "GET" | "POST" = "GET",
  body?: any
): Promise<T | ApiError> {
  const headers = {
    Accept: "application/json",
    Authorization: apiKey,
    "Content-Type": "application/json",
    "User-Agent": "Adamik MCP Server",
  };

  const response = await fetch(url, {
    headers,
    body,
    method,
  });
  const data = await response.json();
  return data as T;
}

export const configSchema = z.object({
  adamikApiKey: z.string().describe("Your Adamik API Key"),
  adamikApiBaseUrl: z.string().optional(),
});

export default function ({ config }: { config: z.infer<typeof configSchema> }) {
  const ADAMIK_API_BASE_URL =
    process.env.ADAMIK_API_BASE_URL ?? config.adamikApiBaseUrl ?? "https://api.adamik.io/api";
  const ADAMIK_API_KEY = process.env.ADAMIK_API_KEY ?? config.adamikApiKey;

  if (!ADAMIK_API_BASE_URL || !ADAMIK_API_KEY) {
    throw new Error("Environment variables ADAMIK_API_BASE_URL and ADAMIK_API_KEY must both be set");
  }

  // Create server instance
  const server = new McpServer({
    name: "adamik-mcp-server",
    version: "0.0.2",
  });

  server.tool(
    "readMeFirst",
    [
      "Get information about how this tool is supposed to be used. Use this tool first before any other tool from this",
      "MCP server",
    ].join(" "),
    {},
    async () => {
      return {
        content: [
          {
            type: "text",
            text: [
              "This MCP server allows any LLM to perform operations on over 60 blockchain networks. For read operations,",
              "this server is enough. But for operation that require wallet connection, submitting transactions, this tool should work in",
              "conjunction with the adamik-signer-mcp-server. That tool will handle wallet connection and signing.",
              "\n\n",
              "## TOOL CATEGORIES:",
              "\n",
              "**OPERATIONAL TOOLS** (for executing blockchain actions):",
              "• getSupportedChains, listFeatures - Chain capabilities",
              "• getAccountState, getAccountHistory - Account data",
              "• getTokenDetails, getChainValidators - Network information",
              "• deriveAddress - Address generation",
              "• encodeTransaction, broadcastTransaction - Transaction lifecycle",
              "• getTransactionDetails - Transaction status",
              "\n",
              "**SPECIFICATION TOOL** (for understanding API requirements):",
              "• getApiSpecification - Complete API reference for exact schemas, formats, and validation rules",
              "\n",
              "**When to use each:**",
              "- Use OPERATIONAL tools when users want current data or to execute actions",
              "- Use getApiSpecification when you need to understand correct formats, troubleshoot errors, or provide guidance",
              "\n\n",
              "## CRITICAL: DECIMAL HANDLING",
              "\n",
              "All balance amounts are returned in SMALLEST UNITS (wei, satoshis, etc.), NOT human-readable values.",
              "ALWAYS follow this pattern:",
              "\n",
              "**For NATIVE CURRENCY balances:**",
              "1. Call listFeatures(chainId) to get the native currency decimals",
              "2. Call getAccountState(chainId, accountId) to get raw balances",
              "3. Convert: human_readable = raw_amount ÷ 10^decimals",
              "Example: Optimism ETH balance '5354656887913579' with 18 decimals = 0.0054 ETH (not 5.35 ETH!)",
              "\n",
              "**For TOKEN balances:**",
              "1. Call getAccountState(chainId, accountId) to get raw token balances and token IDs",
              "2. Call getTokenDetails(chainId, tokenId) for EACH token to get its specific decimals",
              "3. Convert each token: human_readable = raw_amount ÷ 10^token_decimals",
              "Example: USDC balance '2245100' with 6 decimals = 2245100 ÷ 10^6 = 2.2451 USDC",
              "\n\n",
              "IMPORTANT: Many operations require blockchain addresses. If you need to check account balances, transaction history,",
              "or perform other account-specific operations, you have two options:",
              "\n",
              "1. Provide a specific blockchain address (e.g., 0x1234... for Ethereum, bc1... for Bitcoin)",
              "2. Connect to the adamik-signer-mcp-server first to access wallet addresses",
              "\n",
              "If the user hasn't provided an address in their request, please ask them to",
            ].join(" "),
          },
        ],
      };
    }
  );

  server.tool("getSupportedChains", "Get a list of supported chain IDs", {}, async () => {
    const text = chains.join(",");
    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  });

  server.tool(
    "listFeatures",
    "Get chain details including supported features (read, write, token, validators) and native currency information (ticker, decimals, chain name)",
    {
      chainId: ChainIdSchema,
    },
    async ({ chainId }) => {
      if (!chains.includes(chainId)) {
        throw new Error(`Chain ${chainId} is not supported`);
      }
      const features = await makeApiRequest<GetChainDetailsResponse>(
        `${ADAMIK_API_BASE_URL}/chains/${chainId}`,
        ADAMIK_API_KEY
      );
      const text = JSON.stringify(features);
      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    }
  );

  server.tool(
    "getTokenDetails",
    [
      "Fetches information about a non-native token (ERC-20, TRC-20, SPL, etc.) - not the chain's native currency.",
      "CRITICAL: This provides the 'decimals' field needed to convert raw token amounts from getAccountState() to human-readable values.",
      "Always call this for each token when displaying balances: human_readable = raw_amount ÷ 10^token_decimals",
    ].join(" "),
    {
      chainId: ChainIdSchema,
      tokenId: z.string(),
    },
    async ({ chainId, tokenId }) => {
      const details = await makeApiRequest<GetTokenDetailsResponse>(
        `${ADAMIK_API_BASE_URL}/${chainId}/token/${tokenId}`,
        ADAMIK_API_KEY
      );
      const text = JSON.stringify(details);
      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    }
  );

  server.tool(
    "deriveAddress",
    "Derive a blockchain address for a given chain from a public key",
    {
      chainId: ChainIdSchema,
      pubkey: z.string(),
    },
    async ({ chainId, pubkey }: PubkeyToAddressPathParams & PubkeyToAddressRequestBody) => {
      const details = await makeApiRequest<PubkeyToAddressResponse>(
        `${ADAMIK_API_BASE_URL}/${chainId}/address/encode`,
        ADAMIK_API_KEY,
        "POST",
        JSON.stringify({ pubkey })
      );

      const text = JSON.stringify(details);
      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    }
  );

  server.tool(
    "getAccountState",
    [
      "Get the state of an account (balances and staking positions).",
      "IMPORTANT: Balance amounts are returned in smallest units (wei for ETH, satoshis for BTC, etc.).",
      "For NATIVE currency: Use listFeatures() first to get the decimal places, then divide the raw amount by 10^decimals.",
      "For TOKENS: Use getTokenDetails(chainId, tokenId) for each token to get its specific decimals, then convert each token amount.",
      "Example: ETH has 18 decimals, so '5354656887913579' wei = 5354656887913579 ÷ 10^18 = 0.005354656887913579 ETH",
    ].join(" "),
    {
      chainId: ChainIdSchema,
      accountId: z.string(),
    },
    async ({ chainId, accountId }: GetAccountStatePathParams) => {
      const state = await makeApiRequest<GetAccountStateResponse>(
        `${ADAMIK_API_BASE_URL}/${chainId}/account/${accountId}/state`,
        ADAMIK_API_KEY
      );

      const text = JSON.stringify(state);
      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    }
  );

  server.tool(
    "getAccountHistory",
    "Get the transaction history for an account",
    {
      chainId: ChainIdSchema,
      accountId: z.string(),
    },
    async ({ chainId, accountId, nextPage }: GetAccountHistoryPathParams & GetAccountHistoryQueryParams) => {
      const history = await makeApiRequest<GetAccountHistoryResponse>(
        `${ADAMIK_API_BASE_URL}/${chainId}/account/${accountId}/history${
          nextPage ? `?nextPage=${nextPage}` : ""
        }`,
        ADAMIK_API_KEY
      );
      const text = JSON.stringify(history);
      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    }
  );

  server.tool(
    "getChainValidators",
    "Gets the list of known validators for a given chain. This is only useful when asking the user to select a validator to delegate to",
    {
      chainId: ChainIdSchema,
    },
    async ({ chainId, nextPage }: GetChainValidatorsPathParams & GetChainValidatorsQueryParams) => {
      const validators = await makeApiRequest<GetChainValidatorsResponse>(
        `${ADAMIK_API_BASE_URL}/${chainId}/validators${nextPage ? `?nextPage=${nextPage}` : ""}`,
        ADAMIK_API_KEY
      );
      const text = JSON.stringify(validators);

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    }
  );

  server.tool(
    "getTransactionDetails",
    "Gets info about a transaction",
    {
      chainId: ChainIdSchema,
      transactionId: z.string(),
    },
    async ({ chainId, transactionId }: GetTransactionDetailsPathParams) => {
      const transaction = await makeApiRequest<GetTransactionDetailsResponse>(
        `${ADAMIK_API_BASE_URL}/${chainId}/transaction/${transactionId}`,
        ADAMIK_API_KEY
      );

      const text = JSON.stringify(transaction);
      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    }
  );

  server.tool(
    "encodeTransaction",
    [
      "Turns a transaction intent in Adamik JSON format into an encoded transaction for the given chain (ready to sign).",
      "For staking transaction on babylon chain, stakeId is mandatory and amount is optional. Otherwise, amount is",
      "mandatory and stakeId is to be omitted.",
    ].join(" "),
    {
      chainId: ChainIdSchema,
      body: EncodeTransactionRequestBodySchema,
    },
    async ({
      chainId,
      body,
    }: EncodeTransactionPathParams & {
      body: EncodeTransactionRequestBody;
    }) => {
      const encodedResult = await makeApiRequest<EncodeTransactionResponse>(
        `${ADAMIK_API_BASE_URL}/${chainId}/transaction/encode`,
        ADAMIK_API_KEY,
        "POST",
        JSON.stringify(body)
      );
      const text = JSON.stringify(encodedResult);

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    }
  );

  server.tool(
    "broadcastTransaction",
    [
      "Broadcast a signed transaction. You will probably need another MCP server dedicated in key management and signing",
      "before using this.",
    ].join(" "),
    {
      chainId: ChainIdSchema,
      body: BroadcastTransactionRequestBodySchema,
    },
    async ({
      chainId,
      body,
    }: BroadcastTransactionPathParams & {
      body: BroadcastTransactionRequestBody;
    }) => {
      const result = await makeApiRequest<BroadcastTransactionResponse>(
        `${ADAMIK_API_BASE_URL}/${chainId}/transaction/broadcast`,
        ADAMIK_API_KEY,
        "POST",
        JSON.stringify(body)
      );
      const text = JSON.stringify(result);

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    }
  );

  // Simple in-memory cache for the API spec
  let cachedApiSpec: any = null;

  server.tool(
    "getApiSpecification",
    [
      "Get the comprehensive OpenAPI specification for the Adamik API covering 80+ blockchain networks.",
      "This provides authoritative reference for:",
      "• Exact request/response schemas for all transaction types (transfer, stake, unstake, claimRewards, etc.)",
      "• Complete chain family details (EVM, Cosmos, Bitcoin, Solana, Starknet, etc.) with supported features",
      "• Precise parameter formats (amounts in smallest units, address formats, token IDs, validator addresses)",
      "• Transaction encoding formats (RLP, PSBT, BOC, BCS, etc.) and signature requirements",
      "• Account state schemas (native/token balances, staking positions, rewards)",
      "• Error handling patterns and validation rules",
      "• Pagination support for large datasets",
      "Use this when you need exact API contract details for blockchain operations.",
    ].join(" "),
    {
      section: z
        .string()
        .optional()
        .describe(
          "Optional: specific section like 'paths', 'components', 'schemas'. If not provided, returns full spec"
        ),
      refresh: z.boolean().optional().describe("Optional: refresh the cached specification from API"),
    },
    async ({ section, refresh }) => {
      if (!cachedApiSpec || refresh) {
        cachedApiSpec = await makeApiRequest<any>(
          `${ADAMIK_API_BASE_URL.replace("/api", "")}/openapi.json`,
          ADAMIK_API_KEY
        );
      }

      const result = section && cachedApiSpec[section] ? cachedApiSpec[section] : cachedApiSpec;
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  return server.server;
}
