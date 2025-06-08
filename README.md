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
- An Adamik API Key ([Get one here for free](https://adamik.io/))

## Installation

### Adding Adamik MCP Server to your MCP Client

#### YAML (FastAgent Config File)
```yaml
mcp:
  servers:
    adamik:
      command: "npx"
      args: ["@adamik/api-mcp-server"]
      env:
        ADAMIK_API_KEY: "<your-adamik-api-key>"
```

#### JSON (Claude Desktop / NextChat)
```json
{
  "mcpServers": {
    "adamik": {
      "command": "npx",
      "args": [
        "@adamik/api-mcp-server"
      ],
      "env": {
        "ADAMIK_API_KEY": "<your-adamik-api-key>"
      }
    }
  }
}
0
```

### Installing via Smithery

To install Adamik MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@AdamikHQ/adamik-mcp-server):

```bash
npx -y @smithery/cli install @AdamikHQ/adamik-mcp-server --client claude
```

### Local Installation

#### 1. Get Your Free API Key

1. Visit [https://dashboard.adamik.io](https://dashboard.adamik.io)
2. Create a free account
3. Navigate to the API Keys section
4. Generate a new API key
5. Copy the API key and paste it into your `.env` file

#### 2. Clone Repository

```bash
git clone git@github.com:AdamikHQ/adamik-mcp-server.git
cd adamik-mcp-server
```

#### 3. Configure environment variables

- Create environment file:

```bash
cp .env.example .env
```

- Configure your environment variables in `.env`:

```bash
# Required - Your Adamik API key
ADAMIK_API_KEY="your_api_key_here"
```

#### 4. Install dependencies and build:

```bash
pnpm install
pnpm run build
```

#### 5. Configure your client

Depending on which client you are using, look up how to add MCP servers to it. It will most likely be a configuration
file where you should add it either in YAML or JSON. [Jump to section](#adding-adamik-mcp-server-to-your-mcp-client)