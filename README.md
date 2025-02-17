# Adamik MCP Server

## Overview

Adamik MCP Server is a middleware communication protocol server that enables interaction with various blockchain networks through Claude.

## Prerequisites

- Node.js (v16 or higher)
- pnpm
- Git

## Installation

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
ADAMIK_API_KEY=your_api_key_here
L="https://api.adamik.io"
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
Query: Can you get my cosmos address cosmos1yvuhqg73fdzxvam9sj7mazfa38gpn7ulsavh7s? Can you check first Adamik API documentation to get the right path?
```

### Example 2: Starknet Transaction

```
Query:
- Can you check first the Adamik API documentation to get the right path?
- Can you send using my starknet account 0.02 STRK to 0x06D67f670BccF07213f8435bBa34EBDB076d5F129147374860e1DDC3C9eCbc1C? Encode the transaction, sign it, then broadcast it?
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
