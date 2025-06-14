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

**Optional:** Add the [Adamik MCP Signer Server](https://github.com/AdamikHQ/signer-mcp-server) for public key generation and transaction signing to manage real blockchain assets.

## Quick Start

### Prerequisites

- **Node.js** (v20 or higher)
- **Adamik API Key** ([Get one free here](https://adamik.io/))
- **MCP Client** such as:
  - Claude Desktop ([download](https://claude.ai/download)) with Claude Pro subscription
  - FastAgent
  - NextChat

### Installation

```bash
npx @adamik/mcp-server
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

##### For Claude Desktop / NextChat (JSON)

```json
{
  "mcpServers": {
    "adamik-mcp-server": {
      "command": "node",
      "args": ["/Users/YourUsername/GitHub/adamik-mcp-server/build/index.js"],
      "env": {
        "ADAMIK_API_KEY": "<your-adamik-api-key>"
      }
    }
  }
}
```

##### For FastAgent (YAML)

```yaml
mcp:
  servers:
    adamik-mcp-server:
      command: "node"
      args: ["/Users/YourUsername/GitHub/adamik-mcp-server/build/index.js"]
      env:
        ADAMIK_API_KEY: "<your-adamik-api-key>"
```

**Note:** Replace `/Users/YourUsername/GitHub/adamik-mcp-server` with the actual path to your cloned repository.

---

## Transaction Signing

For transaction signing capabilities, see the [Adamik MCP Signer Server](https://github.com/AdamikHQ/signer-mcp-server) repository.

By combining both servers, you can:

- Transfer native currencies and tokens
- Stake and unstake across supported networks
- View real-time account balances
- Execute complex multi-chain operations
- All through natural language commands in your LLM interface
