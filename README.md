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

2. Install dependencies and build:

```bash
pnpm install
pnpm run build
```

### 3. Configuration

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
      "args": ["/Users/adamik-user/GitHub/adamik-mcp-server/build/index.js"]
    }
  }
}
```

> **Note**: After adding the MCP server configuration, restart Claude for the changes to take effect.

## Usage Examples

### Example 1: Query Cosmos Address

```
Query: Can you get my cosmos address cosmos1ksdpkf8l9ypzqqqx38y3x8sdkndw8ytjhuxpwj? Can you check first Adamik API documentation to get the right path?
```

### Example 2: Starknet Transaction

```
Query:
- Can you check first the Adamik API documentation to get the right path?
- Can you send using my starknet account 0.02 STRK to 0x06D67f670BccF07213f8435bBa34EBDB076d5F129147374860e1DDC3C9eCbc1C? Encode the transaction, sign it, then broadcast it?
```
