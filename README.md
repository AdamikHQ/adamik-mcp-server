# Adamik MCP Server

[![smithery badge](https://smithery.ai/badge/@AdamikHQ/adamik-mcp-server)](https://smithery.ai/server/@AdamikHQ/adamik-mcp-server)

<p align="center">
  <img src="logo.svg" alt="Adamik Logo" width="346" height="155"/>
</p>

## Overview

The Adamik MCP Server enables read and write interactions with 60+ blockchain networks through any MCP client, including Claud Desktop.
This server provides an integration with the standardized, multi-chain Adamik API, allowing developers to seamlessly interact with diverse blockchains for transaction management, account insights, staking, and token interactions, all through a unified and enterprise-grade interface.

If you wish to enable pubkey generation and transaction signature, you can also add the Adamik MCP **Signer** Server. This will provide you with a quick and easy way to generate key pairs and manage real blockchain assets through your MCP client.

Byt combininb both the Adamik MCP Server and the Adamik MCP Signer Server, you'll be able to transfer native currencies, tokens and stake through any LLM interface.

## Prerequisites

- Node.js (v20 or higher)
- An Adamik API Key ([Get one here for free](https://adamik.io/))
- pnpm
- Git
- One MCP Client:
  If using Claude make sure to have:

  - Claude Desktop installed (https://claude.ai/download)
  - Claude Pro subscription required (required for MCP Server)

  If using FastAgent

## Installation

Adamik MCP Server: npx @adamik/mcp-server
Adamik MCP Signer Server: npx @adamik/signer-mcp-server

### Adding Adamik MCP Server to your MCP Client

#### YAML (FastAgent Config File)

```yaml
mcp:
  servers:
    adamik:
      command: "npx"
      args: ["@adamik/mcp-server"]
      env:
        ADAMIK_API_KEY: "<your-adamik-api-key>"
```

#### JSON (Claude Desktop / NextChat)

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

### Adding Adamik MCP Signer Server to your MCP Client

To add the Adamik MCP Signer Server, you'll need additional environment variables depending on the Signer provider you wish to use.

So far three different ways of generating keys are possible.
You must use one (and only one) at a single time.

### Signers and environment variables to set

## Sodot

SODOT_VERTEX_URL_0="https://vertex-demo-0.sodot.dev"
SODOT_VERTEX_API_KEY_0="<Sodot Vertex API Key 0>"
SODOT_VERTEX_URL_1="https://vertex-demo-1.sodot.dev"
SODOT_VERTEX_API_KEY_1="<Sodot Vertex API Key 1>"
SODOT_VERTEX_URL_2="https://vertex-demo-2.sodot.dev"
SODOT_VERTEX_API_KEY_2="<Sodot Vertex API Key 2>"
SODOT_EXISTING_ECDSA_KEY_IDS="<Sodot existing ECDSA key IDs split with ,>"
SODOT_EXISTING_ED25519_KEY_IDS="<Sodot existing ED25519 key IDs split with ,>"

## Turnkey

TURNKEY_BASE_URL="https://api.turnkey.com"
TURNKEY_API_PUBLIC_KEY="<Turnkey API Public Key (that starts with 02 or 03)>"
TURNKEY_API_PRIVATE_KEY="<Turnkey API Private Key>"
TURNKEY_ORGANIZATION_ID="<Turnkey organization ID>"
TURNKEY_WALLET_ID="<Turnkey wallet ID>"

## Dfns

DFNS_CRED_ID="<Dfns Credential ID>"
DFNS_PRIVATE_KEY="<Dfns Private Key>"
DFNS_APP_ID="<Dfns App ID>"
DFNS_AUTH_TOKEN="<Dfns Auth Token>"
DFNS_API_URL="<Dfns API URL>"

## Local Seed

UNSECURE_LOCAL_SEED="24 WORDS BIP39 MNEMONIC PHRASE"

information: Please ensure you get the right authentication mechanism for each provider by reaching out to them directly.

#### JSON (Claude Desktop / NextChat)

```json
{
  "mcpServers": {
    "adamik": {
      "command": "npx",
      "args": ["@adamik/signer-mcp-server"],
      "env": {
        "TURNKEY_BASE_URL": "https://api.turnkey.com",
        "TURNKEY_API_PUBLIC_KEY": "<Turnkey API Public Key (that starts with 02 or 03)>",
        "TURNKEY_API_PRIVATE_KEY": "<Turnkey API Private Key>",
        "TURNKEY_ORGANIZATION_ID": "<Turnkey organization ID>",
        "TURNKEY_WALLET_ID": "<Turnkey wallet ID>"
      }
    }
  }
}
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

#### 3. Install dependencies and build:

```bash
pnpm install
pnpm run build
```

#### 5. Configure your client

Depending on which client you are using, look up how to add MCP servers to it. It will most likely be a configuration
file where you should add it either in YAML or JSON. [Jump to section](#adding-adamik-mcp-server-to-your-mcp-client)
