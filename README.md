Clone repository

```
  git clone git@github.com:AdamikHQ/adamik-mcp-server.git
```

install and Build

```
  cp .env.example .env
```

```
  pnpm install
  pnpm run build
```

Open the configuration file or create if it doesn't exist

`code ~/Library/Application\ Support/Claude/claude_desktop_config.json`

and add this config to

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
