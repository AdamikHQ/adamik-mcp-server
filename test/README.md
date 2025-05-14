# Testing the Adamik MCP Server

## About MCP (Model Context Protocol)

MCP is the protocol that allows AI assistants like Claude to interact with external tools and APIs. Here's how the flow works:

1. **User Request**: A user asks Claude a question in natural language (e.g., "What's my Ethereum balance?")

2. **Claude Processing**: Claude interprets this request and determines:

   - This requires blockchain data
   - An external tool needs to be called
   - The appropriate MCP tool and parameters to use

3. **MCP Request**: Claude generates a structured MCP call:

   ```json
   {
     "id": "some-request-id",
     "type": "tool_call",
     "tool": "call-adamik-api",
     "params": {
       "path": "ethereum/address/0x123...789/balances",
       "method": "GET"
     }
   }
   ```

4. **Server Processing**: The Adamik MCP Server:

   - Receives this structured request
   - Forwards it to the Adamik API
   - Returns the response to Claude

5. **User Response**: Claude translates the technical response into natural language and presents it to the user.

## Two MCP Implementations

This project includes two different MCP implementations:

### 1. Full MCP Implementation (`src/index.ts`)

- Uses the official MCP library from `@modelcontextprotocol/sdk`
- This is what's used in production with Claude Desktop
- May have limitations in test environments due to how the library handles stdin/stdout

### 2. Direct Test Implementation (`src/direct-test.ts`)

- Custom implementation of the MCP protocol without using the official library
- Simpler, more transparent, and more stable for testing purposes
- Provides the same functionality with more reliable test output
- **Recommended for development and testing**

## Test Scripts

### 1. `test-direct.js` (Recommended)

Tests the direct implementation by sending sample MCP requests and verifying responses.

```
npm run test:direct
```

### 2. `test-dev.js`

Tests the server directly from TypeScript source using the official MCP library.
Note: Due to stdin/stdout handling differences, this may not work reliably.

```
npm run test:dev
```

### 3. `test-server.js`

Tests the compiled server using the official MCP library.
Note: Due to stdin/stdout handling differences, this may not work reliably.

```
npm test
```

## Writing New Tests

When adding new test cases:

1. Add new request objects to `sample-requests.json`
2. Ensure they follow the MCP protocol format
3. Use realistic API paths based on the Adamik API documentation

Remember that these test requests represent what Claude would generate after processing a natural language query, not the natural language itself.
