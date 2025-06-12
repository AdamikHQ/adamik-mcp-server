# Adamik MCP Server

[![smithery badge](https://smithery.ai/badge/@AdamikHQ/adamik-mcp-server)](https://smithery.ai/server/@AdamikHQ/adamik-mcp-server)

<p align="center">
  <img src="logo.svg" alt="Adamik Logo" width="346" height="155"/>
</p>

## Overview

The Adamik MCP Server enables seamless interactions with 60+ blockchain networks through any MCP client, including Claude Desktop. This server integrates with the multi-chain Adamik API, allowing you to:

- Manage transactions across multiple blockchains
- View account insights and balances
- Interact with tokens and staking
- Access enterprise-grade blockchain infrastructure

**Optional:** Add the Adamik MCP **Signer** Server for public key generation and transaction signing to manage real blockchain assets.

## Quick Start

### Prerequisites

- **Node.js** (v20 or higher)
- **Adamik API Key** ([Get one free here](https://adamik.io/))
- **MCP Client** such as:
  - Claude Desktop ([download](https://claude.ai/download)) with Claude Pro subscription
  - FastAgent
  - NextChat

### Installation

**Adamik MCP Server:**

```bash
npx @adamik/mcp-server
```

**Adamik MCP Signer Server (optional):**

```bash
npx @adamik/signer-mcp-server
```

### Configuration

Add the server to your MCP client configuration:

#### For Claude Desktop / NextChat (JSON)

```json
{
  "mcpServers": {
    "adamik": {
      "command": "npx",
      "args": ["@adamik/mcp-server"],
      "env": {
        "ADAMIK_API_KEY": "<your-adamik-api-key>"
      }
    }
  }
}
```

#### For FastAgent (YAML)

```yaml
mcp:
  servers:
    adamik:
      command: "npx"
      args: ["@adamik/mcp-server"]
      env:
        ADAMIK_API_KEY: "<your-adamik-api-key>"
```

### Get Your API Key

1. Visit [https://dashboard.adamik.io](https://dashboard.adamik.io)
2. Navigate to API Keys → Copy your API key
3. Replace `<your-adamik-api-key>` in your configuration

---

## Advanced Setup

### Local Development Installation

#### 1. Clone Repository

```bash
git clone git@github.com:AdamikHQ/adamik-mcp-server.git
cd adamik-mcp-server
```

#### 2. Install Dependencies

```bash
pnpm install
pnpm run build
```

#### 3. Configure Environment

Create a `.env` file with your API key:

```env
ADAMIK_API_KEY=your-adamik-api-key-here
```

#### 4. Configure Your MCP Client

Update your client configuration to point to the local installation instead of using `npx`.

---

## Signer Server Setup

The Adamik MCP **Signer** Server enables transaction signing and key management. Choose **one** of the following providers:

### Configuration

Add the signer server to your MCP client:

```json
{
  "mcpServers": {
    "adamik-signer": {
      "command": "npx",
      "args": ["@adamik/signer-mcp-server"],
      "env": {
        // Add provider-specific environment variables below
      }
    }
  }
}
```

### Provider Options

#### Local Seed (For Testing Only)

```env
UNSECURE_LOCAL_SEED="your 24 word BIP39 mnemonic phrase here"
```

⚠️ **Warning:** Only use for testing. Not secure for production.

#### Turnkey

```env
TURNKEY_BASE_URL="https://api.turnkey.com"
TURNKEY_API_PUBLIC_KEY="<your-turnkey-public-key>"
TURNKEY_API_PRIVATE_KEY="<your-turnkey-private-key>"
TURNKEY_ORGANIZATION_ID="<your-organization-id>"
TURNKEY_WALLET_ID="<your-wallet-id>"
```

#### Dfns

```env
DFNS_CRED_ID="<your-credential-id>"
DFNS_PRIVATE_KEY="<your-private-key>"
DFNS_APP_ID="<your-app-id>"
DFNS_AUTH_TOKEN="<your-auth-token>"
DFNS_API_URL="<your-api-url>"
```

#### Sodot

```env
SODOT_VERTEX_URL_0="https://vertex-demo-0.sodot.dev"
SODOT_VERTEX_API_KEY_0="<your-vertex-api-key-0>"
SODOT_VERTEX_URL_1="https://vertex-demo-1.sodot.dev"
SODOT_VERTEX_API_KEY_1="<your-vertex-api-key-1>"
SODOT_VERTEX_URL_2="https://vertex-demo-2.sodot.dev"
SODOT_VERTEX_API_KEY_2="<your-vertex-api-key-2>"
SODOT_EXISTING_ECDSA_KEY_IDS="<comma-separated-ecdsa-key-ids>"
SODOT_EXISTING_ED25519_KEY_IDS="<comma-separated-ed25519-key-ids>"
```

> **Note:** Contact each provider directly for authentication setup instructions.

---

## What's Possible

By combining both the Adamik MCP Server and Signer Server, you can:

- Transfer native currencies and tokens
- Stake and unstake across supported networks
- View real-time account balances
- Execute complex multi-chain operations
- All through natural language commands in your LLM interface
