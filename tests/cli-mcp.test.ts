/**
 * Quiz MCP Server CLI Integration Tests
 */
import { spawn, ChildProcessWithoutNullStreams } from "child_process";

// Increase timeout for tests (adjust as needed)
jest.setTimeout(30000);

describe("Quiz MCP Server CLI Integration Tests", () => {
  let serverProcess: ChildProcessWithoutNullStreams | null = null;

  // Start server before all tests
  beforeAll(async () => {
    serverProcess = await startMCPServer();

    // Server initialization
    const initRequest = {
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {
          sampling: {},
        },
        clientInfo: {
          name: "quiz-test-client",
          version: "1.0.0",
        },
      },
      jsonrpc: "2.0",
      id: 0,
    };

    const initResponse = await sendRequest(serverProcess, initRequest);
    console.log("Initialize Response:", JSON.stringify(initResponse, null, 2));

    // Validate response
    expect(initResponse).toBeDefined();
    expect(initResponse.jsonrpc).toBe("2.0");
    expect(initResponse.id).toBe(0);
  });

  // Clean up server after all tests
  afterAll(() => {
    if (serverProcess) {
      console.log("Shutting down server...");
      serverProcess.kill();
    }
  });

  // Test 1: Get quiz with default parameters
  test("should get a quiz with default parameters", async () => {
    if (!serverProcess) {
      throw new Error("Server process is not initialized");
    }

    const quizRequest = {
      method: "tools/call",
      params: {
        name: "get_quiz",
        arguments: {},
      },
      jsonrpc: "2.0",
      id: 1,
    };

    const response = await sendRequest(serverProcess, quizRequest);
    console.log("Default Quiz Response:", JSON.stringify(response, null, 2));

    // Validate response
    expect(response).toBeDefined();
    expect(response.jsonrpc).toBe("2.0");
    expect(response.id).toBe(1);
    expect(response.result).toBeDefined();

    // Quiz response should contain a question and answer
    if (
      response.result &&
      response.result.content &&
      response.result.content[0]
    ) {
      expect(response.result.content[0].text).toContain("Quiz Question");
      expect(response.result.content[0].text).toContain("Answer:");
    }
  });

  // Test 2: Get science quiz with hard difficulty
  test("should get a science quiz with hard difficulty", async () => {
    if (!serverProcess) {
      throw new Error("Server process is not initialized");
    }

    const quizRequest = {
      method: "tools/call",
      params: {
        name: "get_quiz",
        arguments: {
          category: "science",
          difficulty: "hard",
        },
      },
      jsonrpc: "2.0",
      id: 2,
    };

    const response = await sendRequest(serverProcess, quizRequest);
    console.log("Science Quiz Response:", JSON.stringify(response, null, 2));

    // Validate response
    expect(response).toBeDefined();
    expect(response.jsonrpc).toBe("2.0");
    expect(response.id).toBe(2);
    expect(response.result).toBeDefined();

    // Science hard quiz response should contain specific markers
    if (
      response.result &&
      response.result.content &&
      response.result.content[0]
    ) {
      expect(response.result.content[0].text).toContain("science");
      expect(response.result.content[0].text).toContain("hard");
      expect(response.result.content[0].text).toContain("Quiz Question");
      expect(response.result.content[0].text).toContain("Answer:");
    }
  });

  // Test 3: Get history quiz with easy difficulty
  test("should get a history quiz with easy difficulty", async () => {
    if (!serverProcess) {
      throw new Error("Server process is not initialized");
    }

    const quizRequest = {
      method: "tools/call",
      params: {
        name: "get_quiz",
        arguments: {
          category: "history",
          difficulty: "easy",
        },
      },
      jsonrpc: "2.0",
      id: 3,
    };

    const response = await sendRequest(serverProcess, quizRequest);
    console.log("History Quiz Response:", JSON.stringify(response, null, 2));

    // Validate response
    expect(response).toBeDefined();
    expect(response.jsonrpc).toBe("2.0");
    expect(response.id).toBe(3);
    expect(response.result).toBeDefined();

    // History easy quiz response should contain specific markers
    if (
      response.result &&
      response.result.content &&
      response.result.content[0]
    ) {
      expect(response.result.content[0].text).toContain("history");
      expect(response.result.content[0].text).toContain("easy");
      expect(response.result.content[0].text).toContain("Quiz Question");
      expect(response.result.content[0].text).toContain("Answer:");
    }
  });
});

// Start MCP server process
async function startMCPServer() {
  console.log("Starting Quiz MCP server...");

  const serverProcess = spawn("bun", ["src/index.ts"], {
    stdio: ["pipe", "pipe", "pipe"],
  });

  // Output stderr to console
  serverProcess.stderr.on("data", (data) => {
    console.log(`[SERVER LOG] ${data.toString().trim()}`);
  });

  // Wait for server to be ready
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return serverProcess;
}

// Send MCP request
function sendRequest(
  serverProcess: ChildProcessWithoutNullStreams,
  request: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    // Set timeout
    const timeout = setTimeout(() => {
      reject(new Error("Request timed out"));
    }, 10000); // Longer timeout for tests

    // Send request
    const requestJson = JSON.stringify(request);
    console.log(`[SENDING] ${requestJson}`);
    serverProcess.stdin.write(requestJson + "\n");

    // Set up response listener
    const dataHandler = (data: Buffer) => {
      const response = data.toString().trim();
      console.log(`[RECEIVED] ${response}`);

      try {
        // Parse JSON response
        const parsed = JSON.parse(response);
        clearTimeout(timeout);
        serverProcess.stdout.removeListener("data", dataHandler);
        resolve(parsed);
      } catch (error) {
        console.log("[PARSE ERROR]", error);
        // Continue listening if not valid JSON
        console.log(
          "[PARSE ERROR] Not a valid JSON response, continuing to listen"
        );
      }
    };

    serverProcess.stdout.on("data", dataHandler);
  });
}
