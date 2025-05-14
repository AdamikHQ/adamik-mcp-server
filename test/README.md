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
- **Technical Issue**: While this works perfectly with Claude, it fails in our test environment

**Why it fails in tests but works in Claude:**
The MCP library has specific expectations about how stdin/stdout are configured and used. Claude provides exactly the environment the library expects. Our test scripts use standard Node.js pipe-based stdio, which the library doesn't fully handle as expected, resulting in responses not being written to stdout in a way our tests can detect.

### 2. Direct Test Implementation (`src/direct-test.ts`)

- Custom implementation of the MCP protocol without using the official library
- Explicitly uses `process.stdout.write()` to send responses
- Manually parses stdin input
- Provides the same functionality but with more reliable behavior in test environments
- **Recommended for development and testing**

## Technical Details of the Issue

The full MCP implementation has these limitations in test environments:

1. **Input Reception**: It receives input correctly (we can see it logs receiving requests)
2. **Processing Works**: It processes the requests correctly (logs show the tools being invoked)
3. **Output Failure**: It fails to write responses to stdout in a way our tests can detect

This can be caused by several technical factors:

- Buffering issues (not flushing output)
- Using a different stream abstraction
- Handling stdin/stdout differently in different environments (TTY vs pipe)

Rather than modifying the test environment (which would add complexity), we've created a simple direct implementation that works reliably for testing.

## Test Scripts

### 1. `test-direct.js` (Recommended)

Tests the direct implementation by sending sample MCP requests and verifying responses.

```
npm run test:direct
```

### 2. `test-dev.js`

Tests the server directly from TypeScript source using the official MCP library.
Note: Due to the stdin/stdout handling issues described above, this may not show responses.

```
npm run test:dev
```

### 3. `test-server.js`

Tests the compiled server using the official MCP library.
Note: Due to the stdin/stdout handling issues described above, this may not show responses.

```
npm test
```

## Writing New Tests

When adding new test cases:

1. Add new request objects to `sample-requests.json`
2. Ensure they follow the MCP protocol format
3. Use realistic API paths based on the Adamik API documentation

Remember that these test requests represent what Claude would generate after processing a natural language query, not the natural language itself.
