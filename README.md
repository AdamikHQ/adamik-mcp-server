# Adamik MCP Server

[![smithery badge](https://smithery.ai/badge/@AdamikHQ/adamik-mcp-server)](https://smithery.ai/server/@AdamikHQ/adamik-mcp-server)

<p align="center">
  <img src="logo.svg" alt="Adamik Logo" width="346" height="155"/>
</p>

## Overview

The Adamik MCP Server enables read and write interactions with 60+ blockchain networks through Claude Desktop. This server provides an integration with the standardized, multi-chain Adamik API, allowing developers to seamlessly interact with diverse blockchains for transaction management, account insights, staking, and token interactions, all through a unified and enterprise-grade interface.

## Development

### Testing

This project uses two different MCP implementations:

1. **Full MCP Implementation** (`src/index.ts`)

   - Uses the MCP library from `@modelcontextprotocol/sdk`
   - Used in production with Claude Desktop
   - **Technical limitation**: Does not work properly in test scripts due to differences in how stdin/stdout are handled in different environments
   - Claude provides the appropriate runtime environment for this implementation

2. **Direct Test Implementation** (`src/direct-test.ts`)
   - Simple custom implementation of the MCP protocol
   - Bypasses the MCP library entirely
   - Implements the same functionality but with explicit stdin/stdout handling
   - Works reliably in test environments
   - **Recommended for development and testing**

#### Why Two Implementations?

The official MCP library has specific expectations about its runtime environment that Claude satisfies but our test scripts cannot easily replicate. Rather than trying to modify the test environment (which would add complexity), we created a simpler implementation that works reliably for testing.

Think of it as having:

- A production-grade component for real usage (the official MCP implementation)
- A testing-friendly component for development (the direct implementation)

Both implement the same API and functionality.

#### Running Tests

- **Test with direct implementation:** `npm run test:direct` (recommended for development)
- **Test with full MCP implementation:** `npm run test:dev` (limited functionality in test environment)

## Presentation Hints

This MCP server includes presentation hints in its responses to guide Claude in how to best format the data for users. When the server responds to requests, it returns a structured object with both data and presentation guidance:

```json
{
  "data": {
    // The actual API response data
  },
  "presentation": {
    "style": "tabular",
    "title": "Wallet Balance",
    "description": "Present this as a nicely formatted table with token symbols and values.",
    "highlights": ["totalValueUsd"],
    "format": "Token balances should always show 4 decimal places for crypto assets.",
    "sorting": "Sort tokens by value (highest first)."
  }
}
```

### Presentation Styles

The server automatically determines the appropriate presentation style based on the endpoint:

- **Balances** (`/balances`) - Tabular format with token symbols and values
- **Transactions** (`/transactions`) - Chronological list with date grouping
- **Staking Rewards** (`/rewards`) - Summary format with key metrics highlighted
- **Validator Information** (`/validator`) - Profile format with performance metrics

### Adding New Presentation Styles

To add a new presentation style for different endpoints:

1. Update the `addPresentationHints` function in:

   - `src/tools/adamik.ts` (for the full MCP implementation)
   - `src/direct-test.ts` (for the direct test implementation)

2. Add a new condition based on the endpoint path pattern

3. Define appropriate presentation properties for that endpoint type

### How Claude Uses Presentation Hints

Claude uses these hints to determine the optimal way to present the data to users. The hints are not displayed directly but inform Claude's formatting and emphasis decisions when communicating results.

## Prerequisites

- Node.js (v20 or higher)
- pnpm
- Git
- Claude Desktop installed (https://claude.ai/download)
- Claude Pro subscription required

## Installation

### Installing via Smithery

To install Adamik MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@AdamikHQ/adamik-mcp-server):

```bash
npx -y @smithery/cli install @AdamikHQ/adamik-mcp-server --client claude
```

### Installation Steps:

### 1. Clone Repository

```bash
git clone git@github.com:AdamikHQ/adamik-mcp-server.git
cd adamik-mcp-server
```

### 2. Setup and Build

1. Create environment file:

```bash
cp .env.example .env
```

2. Configure your environment variables in `.env`:

```bash
# Required - Your Adamik API key
ADAMIK_API_KEY="your_api_key_here"
ADAMIK_API_BASE_URL="https://api.adamik.io"
```

### 3. Get Your Free API Key

1. Visit [https://dashboard.adamik.io](https://dashboard.adamik.io)
2. Create a free account
3. Navigate to the API Keys section
4. Generate a new API key
5. Copy the API key and paste it into your `.env` file

### 4. Install dependencies and build:

```bash
pnpm install
pnpm run build
```

### 5. Configuration

1. Open or create the Claude configuration file:

```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

2. Add the following configuration:

```json
{
  "mcpServers": {
    "adamik-mcp-server": {
      "command": "node",
      "args": ["/Users/YourUsername/GitHub/adamik-mcp-server/build/index.js"]
    }
  }
}
```

> **Note**: After adding the MCP server configuration, restart Claude for the changes to take effect.

## Usage Examples

### Example 1: Query Cosmos Address

```
Query: Can you get balances of my cosmos address cosmos1yvuhqg73fdzxvam9sj7mazfa38gpn7ulsavh7s? Can you check first Adamik API documentation to learn how to use it?
```

### Example 2: Multi-Chain Balance Queries

```
Query: Can you check my balances across different chains?
- Ethereum: 0x3dD2504c27449a78Df04284129C380f3831cAF0d
- Bitcoin: bc1qekphvuz20qvdhkzywfe29r9vvtwxrszvaxzmqm
- StarkNet: 0x0548A1a8B82AB723C3D770052C4f2E6197215dC12E4bAaBDE1C571D7AA85760e
- TON: UQAQ113dWkP2MOfXN2uv0qPFB-097flcLBhyv0_lhgXEUhwz
```

### Example 3: Transaction History and Validator Information

```
Query:
- What's my latest operation on my dYdX account dydx1yvuhqg73fdzxvam9sj7mazfa38gpn7uleyzn78?
- Can you provide information about this dYdX validator: dydxvaloper1ml44cenapnawcn4xy3w36jce0rg78dm8ajvypn?
```

### Example 4: Staking Rewards Query

```
Query: What are my current pending rewards on Osmosis address osmo1yvuhqg73fdzxvam9sj7mazfa38gpn7ulcxl8gz?
```

## Features

### Key Features

**Multi-Chain Support**: The API provides unified access to multiple blockchain networks, including popular chains like Ethereum, Starknet, Cosmos, Bitcoin, and many others. This allows developers to interact with different blockchains using a consistent interface.

**Transaction Management**: The API offers comprehensive transaction-related functionalities, including:

- Transaction encoding (preparing the transaction before signing)
- Transaction validation (checking if the transaction is valid)
- Transaction broadcasting (sending the transaction to the network)
- Retrieving transaction details and status

**Account Management**: Provides detailed account-related services such as:

- Retrieving account state (balances)
- Checking token balances
- Viewing account transaction history

**Utility Functions**: Offers helpful utility endpoints like:

- Address validation
- Public key to address conversion
- Chain and token information retrieval

**Staking Support**: Includes features for proof-of-stake blockchains, such as:

- Staking transactions
- Unstaking
- Claiming staking rewards
- Validator information retrieval

**Token Interaction**: Enables interactions with different token types, including:

- Native currency transfers (for instance sending ETH on Ethereum or Algorand)
- Token transfers (for instance sending USDC on Ethereum or Tron)
- Retrieving token details across various blockchain standards (ERC20, TRC20, ASA, etc.)

The API essentially aims to provide a standardized, cross-chain interface for blockchain interactions, simplifying the complexity of working with multiple blockchain networks.

## Security Considerations

- Private keys are currently stored securely in `.env`
- Only use test wallets with small amounts for development

## Adamik API Documentation

For detailed API documentation, visit [https://docs.adamik.io](https://docs.adamik.io)

### Rate Limits

- Free tier: 10k requests/month
- Premium tier: [Contact us](https://adamik.io/contact) for custom pricing and higher rate limits

## Support

Need help or have questions? Visit our [contact page](https://adamik.io/contact) or check our [API documentation](https://docs.adamik.io).

## License

This project is licensed under the [MIT License](LICENSE).

Contributions are welcome! Feel free to submit pull requests or open issues.
