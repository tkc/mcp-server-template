/**
 * Quiz MCP - Model Context Protocol (MCP) Server Implementation
 *
 * A specialized MCP server that provides interactive quiz functionality
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Logger utility
function log(level: string, ...args: any[]) {
  console.error(`[${level.toUpperCase()}]`, ...args);
}

// Quiz tool schema definition
const QuizSchema = z.object({
  category: z
    .enum(["general", "science", "history", "geography", "entertainment"])
    .optional()
    .describe("The category of questions to ask"),
  difficulty: z
    .enum(["easy", "medium", "hard"])
    .optional()
    .describe("The difficulty level of the quiz"),
});

// Sample quiz questions by category and difficulty
const quizQuestions = {
  general: {
    easy: [
      { question: "What is the capital of France?", answer: "Paris" },
      { question: "Which planet is known as the Red Planet?", answer: "Mars" },
      { question: "How many continents are there on Earth?", answer: "7" },
    ],
    medium: [
      { question: "In which year did World War II end?", answer: "1945" },
      { question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci" },
      { question: "What is the chemical symbol for gold?", answer: "Au" },
    ],
    hard: [
      {
        question: "What is the smallest prime number greater than 100?",
        answer: "101",
      },
      { question: "Which element has the atomic number 79?", answer: "Gold" },
      { question: "Who wrote 'War and Peace'?", answer: "Leo Tolstoy" },
    ],
  },
  science: {
    easy: [
      { question: "What is H2O commonly known as?", answer: "Water" },
      {
        question: "What force pulls objects toward the Earth?",
        answer: "Gravity",
      },
      {
        question: "What is the largest organ in the human body?",
        answer: "Skin",
      },
    ],
    medium: [
      {
        question: "What is the process by which plants make food called?",
        answer: "Photosynthesis",
      },
      {
        question: "What is the hardest natural substance on Earth?",
        answer: "Diamond",
      },
      { question: "What is the chemical symbol for sodium?", answer: "Na" },
    ],
    hard: [
      {
        question:
          "What particle has the same mass as an electron but positive charge?",
        answer: "Positron",
      },
      { question: "Which planet has the most moons?", answer: "Saturn" },
      {
        question:
          "What is the name of the process whereby solid dry ice changes directly to gas?",
        answer: "Sublimation",
      },
    ],
  },
  history: {
    easy: [
      {
        question: "Who was the first President of the United States?",
        answer: "George Washington",
      },
      { question: "In which year did the Titanic sink?", answer: "1912" },
      {
        question:
          "What was the name of the first artificial satellite launched into space?",
        answer: "Sputnik 1",
      },
    ],
    medium: [
      {
        question:
          "Who was the Egyptian queen who allied with Julius Caesar and Mark Antony?",
        answer: "Cleopatra",
      },
      {
        question: "Which empire was ruled by Genghis Khan?",
        answer: "Mongol Empire",
      },
      { question: "In which year did the Berlin Wall fall?", answer: "1989" },
    ],
    hard: [
      {
        question: "Who was the founder of the Ottoman Empire?",
        answer: "Osman I",
      },
      {
        question:
          "Which battle in 1815 marked the final defeat of Napoleon Bonaparte?",
        answer: "Battle of Waterloo",
      },
      {
        question: "Who was the first Emperor of China?",
        answer: "Qin Shi Huang",
      },
    ],
  },
  geography: {
    easy: [
      {
        question: "What is the largest ocean on Earth?",
        answer: "Pacific Ocean",
      },
      {
        question: "What is the largest desert in the world?",
        answer: "Sahara Desert",
      },
      {
        question: "What is the name of the longest river in Africa?",
        answer: "Nile",
      },
    ],
    medium: [
      { question: "What is the capital of Canada?", answer: "Ottawa" },
      {
        question: "Which mountain range separates Europe from Asia?",
        answer: "Ural Mountains",
      },
      {
        question: "Which country has the largest population in the world?",
        answer: "China",
      },
    ],
    hard: [
      {
        question: "What is the smallest country in the world by land area?",
        answer: "Vatican City",
      },
      {
        question: "Which city is located on two continents?",
        answer: "Istanbul",
      },
      { question: "What is the capital of New Zealand?", answer: "Wellington" },
    ],
  },
  entertainment: {
    easy: [
      {
        question: "Who played Harry Potter in the Harry Potter movies?",
        answer: "Daniel Radcliffe",
      },
      {
        question: "What is the name of Mickey Mouse's pet dog?",
        answer: "Pluto",
      },
      { question: "Who painted the Starry Night?", answer: "Vincent van Gogh" },
    ],
    medium: [
      {
        question: "Which band performed the album 'Dark Side of the Moon'?",
        answer: "Pink Floyd",
      },
      {
        question: "Who directed the movie 'Jaws'?",
        answer: "Steven Spielberg",
      },
      {
        question:
          "Which actor played Iron Man in the Marvel Cinematic Universe?",
        answer: "Robert Downey Jr.",
      },
    ],
    hard: [
      {
        question: "Who won the Best Actress Oscar Award in 2020?",
        answer: "Renée Zellweger",
      },
      {
        question:
          "In the TV show Friends, what was the name of Ross's second wife?",
        answer: "Emily",
      },
      {
        question: "Who composed the opera 'The Marriage of Figaro'?",
        answer: "Wolfgang Amadeus Mozart",
      },
    ],
  },
};

// Initialize MCP server
const server = new McpServer({
  name: "quiz-mcp-server",
  version: "1.0.0",
  description:
    "A specialized Model Context Protocol server that provides interactive quiz functionality across various knowledge domains. This server offers customizable quizzes with different categories and difficulty levels, allowing users to test their knowledge in general knowledge, science, history, geography, and entertainment. Each quiz provides immediate feedback and correct answers, making it an educational and engaging tool for learning and assessment.",
});

// Quiz tool implementation
server.tool(
  "get_quiz",
  "Provides an interactive quiz on various topics. This tool generates quiz questions based on specified categories and difficulty levels. Users can request quizzes in domains like general knowledge, science, history, geography, and entertainment, with difficulty levels ranging from easy to hard. Each response includes a carefully selected question and its corresponding answer to facilitate learning and knowledge testing. Ideal for educational purposes, trivia games, or casual learning experiences.",
  QuizSchema.shape,
  async (args) => {
    try {
      // Default values if not specified
      const category = args.category || "general";
      const difficulty = args.difficulty || "medium";

      log(
        "info",
        `Quiz tool called with category=${category}, difficulty=${difficulty}`,
      );

      // Get questions for the selected category and difficulty
      const questionsPool = quizQuestions[category][difficulty];

      // Select a random question
      const selectedQuestion =
        questionsPool[Math.floor(Math.random() * questionsPool.length)];

      return {
        content: [
          {
            type: "text",
            text: `Quiz Question (${category}, ${difficulty}):\n\n${selectedQuestion.question}\n\nAnswer: ${selectedQuestion.answer}`,
          },
        ],
        isError: false,
      };
    } catch (error) {
      log("error", "Quiz tool error:", error);

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

// Server start function
async function main() {
  try {
    log("info", "Starting Quiz MCP server...");

    // Configure transport
    const transport = new StdioServerTransport();

    // Connect server to transport
    await server.connect(transport);

    // Display startup messages
    log("info", "Quiz MCP Server started");
    log("info", "Available tool: get_quiz");
    log("info", "Listening for requests...");
  } catch (error) {
    log("error", "Failed to start Quiz MCP Server:", error);
    process.exit(1);
  }
}

// Process termination handler
process.on("SIGINT", () => {
  log("info", "Server shutting down...");
  process.exit(0);
});

// Error handler
process.on("uncaughtException", (error) => {
  log("error", "Uncaught exception:", error);
});

// Run the server
main().catch((error) => {
  log("error", "Unexpected error:", error);
  process.exit(1);
});
