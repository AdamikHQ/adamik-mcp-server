# Adamik MCP Server
[![smithery badge](https://smithery.ai/badge/@AdamikHQ/adamik-mcp-server)](https://smithery.ai/server/@AdamikHQ/adamik-mcp-server)

<p align="center">
  <img src="logo.svg" alt="Adamik Logo" width="346" height="155"/>
</p>

## Overview

The Adamik MCP Server enables read and write interactions with 60+ blockchain networks through Claude Desktop. This server provides an integration with the standardized, multi-chain Adamik API, allowing developers to seamlessly interact with diverse blockchains for transaction management, account insights, staking, and token interactions, all through a unified and enterprise-grade interface.

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
