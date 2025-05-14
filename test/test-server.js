#!/usr/bin/env node

/**
 * Adamik MCP Server Test Script (Production Build)
 *
 * This script tests the compiled MCP server by sending structured MCP requests directly to it.
 *
 * Note: In a real usage scenario:
 * 1. Users type natural language queries to Claude (e.g., "What's my ETH balance?")
 * 2. Claude processes this and generates structured MCP requests like those in sample-requests.json
 * 3. The MCP server processes these structured requests and returns responses
 * 4. Claude translates the technical responses back to natural language for the user
 *
 * This test script only tests steps 2-3 of this process (the MCP server's handling of requests).
 */

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const readline = require("readline");

// Path to the compiled server
const serverPath = path.resolve(__dirname, "../dist/index.js");

// Check if the server is compiled
if (!fs.existsSync(serverPath)) {
  console.error(
    '\x1b[31mError: Server not compiled. Run "npm run build" first.\x1b[0m'
  );
  process.exit(1);
}

// Load sample requests
const sampleRequests = require("./sample-requests.json");

console.log("\x1b[36m=== Adamik MCP Server Test ===\x1b[0m");
console.log("\x1b[33mStarting server...\x1b[0m");

// Start the MCP server process
const server = spawn("node", [serverPath], {
  stdio: ["pipe", "pipe", "inherit"],
});

// Handle server exit
server.on("exit", (code) => {
  if (code !== null && code !== 0) {
    console.error(`\x1b[31mServer exited with code ${code}\x1b[0m`);
  }
});

// Create readline interface to parse server responses
const rl = readline.createInterface({
  input: server.stdout,
  terminal: false,
});

// Handle server responses
rl.on("line", (line) => {
  try {
    const response = JSON.parse(line);
    console.log("\x1b[32mResponse received:\x1b[0m");
    console.log(JSON.stringify(response, null, 2));

    // If this was the last request, exit
    if (response.id === sampleRequests[sampleRequests.length - 1].id) {
      console.log("\x1b[36m=== Test completed successfully ===\x1b[0m");
      server.kill();
      process.exit(0);
    }
  } catch (error) {
    console.error("\x1b[31mError parsing response:\x1b[0m", error);
    console.error("Raw output:", line);
  }
});

// Send each request with a delay
let requestIndex = 0;

function sendNextRequest() {
  if (requestIndex < sampleRequests.length) {
    const request = sampleRequests[requestIndex];
    console.log(
      `\x1b[33mSending request ${requestIndex + 1}/${sampleRequests.length}: ${
        request.tool
      }\x1b[0m`
    );
    server.stdin.write(JSON.stringify(request) + "\n");
    requestIndex++;

    // Schedule next request after a delay
    setTimeout(sendNextRequest, 2000);
  }
}

// Start sending requests after a short delay to allow server initialization
setTimeout(sendNextRequest, 1000);

// Handle script termination
process.on("SIGINT", () => {
  console.log("\x1b[33mTerminating test...\x1b[0m");
  server.kill();
  process.exit(0);
});
