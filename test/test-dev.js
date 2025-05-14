#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");
const readline = require("readline");
const sampleRequests = require("./sample-requests.json");

console.log("\x1b[36m=== Adamik MCP Server Test (Dev Mode) ===\x1b[0m");
console.log("\x1b[33mStarting server with ts-node...\x1b[0m");

// Start the MCP server with ts-node
const server = spawn(
  "npx",
  ["ts-node", path.resolve(__dirname, "../src/index.ts")],
  {
    stdio: ["pipe", "pipe", "inherit"],
  }
);

// Create readline interface to parse server responses
const rl = readline.createInterface({
  input: server.stdout,
  terminal: false,
});

// Handle server responses
rl.on("line", (line) => {
  try {
    // Only try to parse lines that look like JSON
    if (line.trim().startsWith("{")) {
      const response = JSON.parse(line);
      console.log("\x1b[32mResponse received:\x1b[0m");
      console.log(JSON.stringify(response, null, 2));

      // If this was the last request, exit
      if (response.id === sampleRequests[sampleRequests.length - 1].id) {
        console.log("\x1b[36m=== Test completed successfully ===\x1b[0m");
        server.kill();
        process.exit(0);
      }
    } else {
      console.log("\x1b[90m" + line + "\x1b[0m"); // Output server logs in gray
    }
  } catch (error) {
    console.log("\x1b[90m" + line + "\x1b[0m"); // Output non-JSON as server logs
  }
});

// Give server time to initialize
setTimeout(() => {
  // Send each request individually
  let requestIndex = 0;

  function sendNextRequest() {
    if (requestIndex < sampleRequests.length) {
      const request = sampleRequests[requestIndex];
      console.log(
        `\x1b[33mSending request ${requestIndex + 1}/${
          sampleRequests.length
        }: ${request.tool}\x1b[0m`
      );
      server.stdin.write(JSON.stringify(request) + "\n");
      requestIndex++;

      // Schedule next request after a delay
      setTimeout(sendNextRequest, 2000);
    }
  }

  sendNextRequest();
}, 2000);

// Handle script termination
process.on("SIGINT", () => {
  console.log("\x1b[33mTerminating test...\x1b[0m");
  server.kill();
  process.exit(0);
});
