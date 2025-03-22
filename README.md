# Bun MCP Template

A simple Model Context Protocol (MCP) server implementation using Bun runtime.

## Environment Requirements

- **Bun**: v1.0.0 or higher
  - Installation: [https://bun.sh/docs/installation](https://bun.sh/docs/installation)
- **Node.js**: v18.0.0 or higher (for some dependencies)
- **Operating System**:
  - macOS 12+
  - Linux with glibc 2.31+
  - Windows 10+ (via WSL)

## Features

- Simple MCP server implementation
- Basic tools: echo and greeting
- Jest testing setup
- CLI-based interaction test

## Installation

```bash
# Clone the repository
git clone https://github.com/username/bun-mcp-template.git
cd bun-mcp-template

# Install dependencies
bun install
```

## Usage

### Running the Server

```bash
# Start the server
bun start

# Development mode (with auto-restart)
bun dev
```

### Testing

```bash
# Run all tests
bun test

# Run only MCP integration tests
bun test:cli-jest

# Run CLI based test
bun test:cli
```

## MCP Tools

This server provides two simple tools:

1. **echo**: Echoes back any message you send

   ```json
   {
     "method": "tools/call",
     "params": {
       "name": "echo",
       "arguments": {
         "message": "Hello, world!"
       }
     },
     "jsonrpc": "2.0",
     "id": 1
   }
   ```

2. **greeting**: Provides a personalized greeting
   ```json
   {
     "method": "tools/call",
     "params": {
       "name": "greeting",
       "arguments": {
         "name": "John"
       }
     },
     "jsonrpc": "2.0",
     "id": 2
   }
   ```

## Project Structure

```
bun-mcp-template/
├── src/
│   └── index.ts       # Main MCP server implementation
├── tests/
│   └── cli-mcp.test.ts # MCP integration tests
├── cli-test.ts        # CLI-based test script
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Adding New Tools

To add a new tool to the MCP server, follow this pattern:

```typescript
// 1. Define schema
const MyToolSchema = z.object({
  parameter1: z.string().describe("Description of parameter1"),
  parameter2: z.number().optional().describe("Description of parameter2"),
});

// 2. Implement tool
server.tool(
  "my_tool_name",
  "Description of what this tool does.",
  MyToolSchema.shape,
  async (args) => {
    try {
      // Tool implementation
      return {
        content: [
          {
            type: "text",
            text: "Response from the tool",
          },
        ],
        isError: false,
      };
    } catch (error) {
      // Error handling
      return {
        content: [
          {
            type: "text",
            text: `An error occurred: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  },
);
```

## License

MIT

## Acknowledgements

This project uses the Model Context Protocol (MCP) developed by Anthropic.
