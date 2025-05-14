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

## Test Scripts

The test scripts in this directory are specifically testing the MCP server component, not the entire Claude + MCP flow. That's why they use structured MCP requests directly rather than natural language.

### sample-requests.json

Contains examples of MCP requests that Claude might generate, structured in the format expected by the MCP server.

### test-server.js

Tests the compiled server by sending sample MCP requests and verifying responses.

### test-dev.js

Tests the server directly from TypeScript source (without building), useful during development.

## Running Tests

- `npm test`: Run tests against the compiled server
- `npm run test:dev`: Run tests directly against the TypeScript source

## Writing New Tests

When adding new test cases:

1. Add new request objects to `sample-requests.json`
2. Ensure they follow the MCP protocol format
3. Use realistic API paths based on the Adamik API documentation

Remember that these test requests represent what Claude would generate after processing a natural language query, not the natural language itself.
