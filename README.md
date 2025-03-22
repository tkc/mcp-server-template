# MCP Server Template

A specialized Model Context Protocol (MCP) server implementation for interactive quizzes using Bun runtime.

## Environment Requirements

- **Bun**: v1.0.0 or higher
  - Installation: [https://bun.sh/docs/installation](https://bun.sh/docs/installation)
- **Node.js**: v18.0.0 or higher (for some dependencies)
- **Operating System**:
  - macOS 12+
  - Linux with glibc 2.31+
  - Windows 10+ (via WSL)

## Features

- Specialized quiz-focused MCP server implementation
- Quiz tool with multiple categories and difficulty levels
- Jest testing setup with MCP integration tests
- Comprehensive test coverage

## Installation

```bash
# Clone the repository
git clone https://github.com/username/quiz-mcp-template.git
cd quiz-mcp-template

# Install dependencies
bun install
```

## Claude Desktop Setting

```json
{
  "quiz": {
    "command": "/Users/takeshiiijima/.bun/bin/bun",
    "args": ["run", "<your path>/bun-mcp-template/src/index.ts"]
  }
}
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
```

## MCP Tools

This server provides an interactive quiz tool:

**get_quiz**: Provides quiz questions across different categories and difficulty levels

```json
{
  "method": "tools/call",
  "params": {
    "name": "get_quiz",
    "arguments": {
      "category": "science",
      "difficulty": "medium"
    }
  },
  "jsonrpc": "2.0",
  "id": 1
}
```

Available categories:

- general
- science
- history
- geography
- entertainment

Difficulty levels:

- easy
- medium
- hard

## Project Structure

```
quiz-mcp-template/
├── src/
│   └── index.ts       # Main Quiz MCP server implementation
├── tests/
│   └── cli-mcp.test.ts # MCP integration tests
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Extending Quiz Categories

To add new quiz categories or questions, modify the `quizQuestions` object in `src/index.ts`:

```typescript
// Add new category
quizQuestions.newCategory = {
  easy: [
    { question: "Easy question 1?", answer: "Answer 1" },
    { question: "Easy question 2?", answer: "Answer 2" },
    // Add more questions...
  ],
  medium: [
    { question: "Medium question 1?", answer: "Answer 1" },
    { question: "Medium question 2?", answer: "Answer 2" },
    // Add more questions...
  ],
  hard: [
    { question: "Hard question 1?", answer: "Answer 1" },
    { question: "Hard question 2?", answer: "Answer 2" },
    // Add more questions...
  ],
};

// Don't forget to update the schema to include the new category
const QuizSchema = z.object({
  category: z
    .enum([
      "general",
      "science",
      "history",
      "geography",
      "entertainment",
      "newCategory",
    ])
    .optional()
    .describe("The category of questions to ask"),
  // ...
});
```

## License

MIT

## Acknowledgements

This project uses the Model Context Protocol (MCP) developed by Anthropic and provides an educational quiz tool for AI assistants.
