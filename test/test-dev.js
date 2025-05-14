#!/usr/bin/env node

/**
 * Adamik MCP Server Test Script (Development Mode)
 *
 * This script tests the MCP server by sending structured MCP requests directly to it.
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
const readline = require("readline");
const sampleRequests = require("./sample-requests.json");

// Terminal colors and formatting
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  // Foreground colors
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
  // Background colors
  bg: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
  },
};

// Helper to print a separator line
function printSeparator() {
  console.log(colors.fg.gray + "─".repeat(80) + colors.reset);
}

// Helper to format JSON
function formatJson(obj) {
  try {
    if (typeof obj === "string") {
      obj = JSON.parse(obj);
    }
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return obj;
  }
}

// Clear screen and print header
console.clear();
console.log(
  colors.bright +
    colors.fg.cyan +
    "\n┌─────────────────────────────────────────┐"
);
console.log("│   ADAMIK MCP SERVER TEST (DEV MODE)   │");
console.log("└─────────────────────────────────────────┘\n" + colors.reset);

console.log(
  colors.fg.yellow + "Starting server with ts-node..." + colors.reset
);

// Start the MCP server with ts-node
const server = spawn(
  "npx",
  ["ts-node", path.resolve(__dirname, "../src/index.ts")],
  {
    stdio: ["pipe", "pipe", "pipe"], // Capture stderr too
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
  console.log(colors.fg.gray + "SERVER LOG: " + line + colors.reset);
});

let responseCount = 0;
let pendingRequests = new Map(); // Map of ID -> request details

// Set a global timeout to prevent the script from running indefinitely
const TEST_TIMEOUT = 30000; // 30 seconds
const timeoutId = setTimeout(() => {
  console.log(
    colors.bright +
      colors.fg.red +
      "\n⚠️ TEST TIMED OUT - Server may not be responding correctly\n" +
      colors.reset
  );

  if (pendingRequests.size > 0) {
    console.log(
      colors.fg.yellow +
        "Pending requests that received no response:" +
        colors.reset
    );
    pendingRequests.forEach((request, id) => {
      console.log(
        colors.fg.yellow + ` - ${id} (${request.tool})` + colors.reset
      );
    });
  }

  server.kill();
  process.exit(1);
}, TEST_TIMEOUT);

// Handle server responses
stdoutRL.on("line", (line) => {
  // First display the raw line for debugging
  console.log(colors.fg.blue + "RAW OUTPUT: " + line + colors.reset);

  try {
    // Try to parse as JSON
    const response = JSON.parse(line);
    responseCount++;

    // Find the original request
    const requestId = response.id;
    const originalRequest = pendingRequests.get(requestId);
    pendingRequests.delete(requestId);

    printSeparator();
    console.log(
      colors.bright +
        colors.fg.green +
        `RESPONSE #${responseCount}: ${requestId}` +
        colors.reset
    );

    if (originalRequest) {
      console.log(
        colors.fg.cyan + `For tool: ${originalRequest.tool}` + colors.reset
      );
    }

    // Check if response has error
    const hasError =
      response.error ||
      (response.content &&
        response.content[0] &&
        response.content[0].text &&
        response.content[0].text.includes("Error"));

    if (hasError) {
      console.log(colors.fg.red + "STATUS: ERROR" + colors.reset);
      console.log(
        colors.fg.red +
          "ERROR DETAILS: " +
          (response.error || response.content?.[0]?.text || "Unknown error") +
          colors.reset
      );
    } else {
      console.log(colors.fg.green + "STATUS: SUCCESS" + colors.reset);
    }

    console.log(colors.bright + "CONTENT:" + colors.reset);
    console.log(formatJson(response));
    printSeparator();

    // If we've gotten responses for all requests, exit
    if (pendingRequests.size === 0 && responseCount >= sampleRequests.length) {
      clearTimeout(timeoutId);
      console.log(
        colors.bright +
          colors.fg.cyan +
          "\n✓ TEST COMPLETED SUCCESSFULLY - All requests processed\n" +
          colors.reset
      );
      server.kill();
      process.exit(0);
    }
  } catch (error) {
    // If not JSON, just output as server log
    console.log(colors.fg.gray + "SERVER INFO: " + line + colors.reset);
  }
});

// Track server errors
server.on("error", (error) => {
  console.error(colors.fg.red + "SERVER ERROR: " + error + colors.reset);
});

// Handle server exit
server.on("exit", (code) => {
  clearTimeout(timeoutId);
  if (code !== null && code !== 0) {
    console.error(
      colors.fg.red + `Server exited with code ${code}` + colors.reset
    );
    process.exit(code);
  }
});

// Give server time to initialize
console.log(
  colors.fg.yellow + "Waiting for server initialization..." + colors.reset
);

setTimeout(() => {
  // Print status of pending requests every 5 seconds
  const statusInterval = setInterval(() => {
    if (pendingRequests.size > 0) {
      console.log(
        colors.fg.yellow +
          `STATUS UPDATE: Waiting for ${pendingRequests.size} responses...` +
          colors.reset
      );
    }
  }, 5000);

  // Make sure to clear the interval when exiting
  process.on("exit", () => clearInterval(statusInterval));

  // Send each request individually
  let requestIndex = 0;

  function sendNextRequest() {
    if (requestIndex < sampleRequests.length) {
      const request = sampleRequests[requestIndex];

      // Store in pending requests map
      pendingRequests.set(request.id, request);

      // Print request details
      printSeparator();
      console.log(
        colors.bright +
          colors.fg.yellow +
          `REQUEST #${requestIndex + 1}/${sampleRequests.length}: ${
            request.id
          }` +
          colors.reset
      );
      console.log(colors.fg.yellow + `Tool: ${request.tool}` + colors.reset);
      console.log(colors.bright + "Params:" + colors.reset);
      console.log(formatJson(request.params));

      // Send the request
      server.stdin.write(JSON.stringify(request) + "\n");
      console.log(
        colors.fg.blue + "SENT: " + JSON.stringify(request) + colors.reset
      );

      requestIndex++;

      // Schedule next request after a delay
      setTimeout(sendNextRequest, 3000);
    }
  }

  sendNextRequest();
}, 4000);

// Handle script termination
process.on("SIGINT", () => {
  clearTimeout(timeoutId);
  console.log(colors.fg.yellow + "\nTerminating test...\n" + colors.reset);
  server.kill();
  process.exit(0);
});
