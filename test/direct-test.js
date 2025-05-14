#!/usr/bin/env node

/**
 * Test script for the direct-test implementation
 * This script bypasses the MCP library and uses a direct implementation
 */

const { spawn } = require("child_process");
const path = require("path");
const readline = require("readline");
const sampleRequests = require("./sample-requests.json");

// Terminal colors and formatting
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",
  },
};

// Clear screen and print header
console.clear();
console.log(
  colors.bright +
    colors.fg.cyan +
    "\n┌─────────────────────────────────────────┐"
);
console.log("│     DIRECT TEST MCP IMPLEMENTATION     │");
console.log("└─────────────────────────────────────────┘\n" + colors.reset);

console.log(
  colors.fg.yellow +
    "Starting direct test server with ts-node..." +
    colors.reset
);

// Start the direct test implementation
const server = spawn(
  "npx",
  ["ts-node", path.resolve(__dirname, "../src/direct-test.ts")],
  {
    stdio: ["pipe", "pipe", "pipe"],
  }
);

// Create readline interface for stdout
const stdoutRL = readline.createInterface({
  input: server.stdout,
  terminal: false,
});

// Create readline interface for stderr
const stderrRL = readline.createInterface({
  input: server.stderr,
  terminal: false,
});

// Log stderr output in gray
stderrRL.on("line", (line) => {
  console.log(colors.fg.gray + line + colors.reset);
});

// Handle stdout (responses)
stdoutRL.on("line", (line) => {
  try {
    const response = JSON.parse(line);
    console.log(
      colors.bright + colors.fg.green + "RECEIVED RESPONSE:" + colors.reset
    );
    console.log(JSON.stringify(response, null, 2));
    console.log(
      colors.bright +
        colors.fg.green +
        "✓ Response received successfully" +
        colors.reset
    );
  } catch (error) {
    console.log(
      colors.fg.red + "Error parsing response: " + error.message + colors.reset
    );
    console.log(colors.fg.blue + "Raw output: " + line + colors.reset);
  }
});

// Set a timeout
const timeout = setTimeout(() => {
  console.log(
    colors.fg.red + "\nTest timed out. No responses received." + colors.reset
  );
  server.kill();
  process.exit(1);
}, 10000);

// Send test requests
setTimeout(() => {
  console.log(colors.fg.yellow + "\nSending echo request..." + colors.reset);
  const echoRequest = sampleRequests.find((req) => req.tool === "echo");
  if (echoRequest) {
    console.log(JSON.stringify(echoRequest, null, 2));
    server.stdin.write(JSON.stringify(echoRequest) + "\n");
  }

  // Send another request after a delay
  setTimeout(() => {
    console.log(
      colors.fg.yellow + "\nSending documentation request..." + colors.reset
    );
    const docsRequest = sampleRequests.find(
      (req) => req.tool === "get-adamik-documentation"
    );
    if (docsRequest) {
      console.log(JSON.stringify(docsRequest, null, 2));
      server.stdin.write(JSON.stringify(docsRequest) + "\n");
    }

    // Clean exit after all tests
    setTimeout(() => {
      clearTimeout(timeout);
      console.log(colors.fg.cyan + "\nTest completed." + colors.reset);
      server.kill();
      process.exit(0);
    }, 3000);
  }, 2000);
}, 1000);

// Handle cleanup
process.on("SIGINT", () => {
  clearTimeout(timeout);
  console.log(colors.fg.yellow + "\nTest interrupted." + colors.reset);
  server.kill();
  process.exit(0);
});
