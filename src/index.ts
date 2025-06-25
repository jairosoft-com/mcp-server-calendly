import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CalendlyService } from "./services/calendly.service.js";
import { registerCalendlyTools } from "./tools/calendlyTools.js";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check if CALENDLY_PERSONAL_ACCESS_TOKEN is set
const apiKey = process.env.CALENDLY_PERSONAL_ACCESS_TOKEN;
if (!apiKey) {
  console.error('Error: CALENDLY_PERSONAL_ACCESS_TOKEN environment variable is not set');
  process.exit(1);
}

// Create server instance
const server = new McpServer({
  name: "calendly",
  version: "1.0.0",
  description: "MCP server for Calendly integration"
});

// Initialize Calendly service
let calendlyService: CalendlyService;
try {
  console.error("Initializing Calendly service...");
  calendlyService = new CalendlyService(apiKey);
  console.error("Calendly service initialized successfully");
} catch (error) {
  console.error("Failed to initialize Calendly service:", error);
  process.exit(1);
}

// Register Calendly tools
try {
  console.error("Registering Calendly tools...");
  registerCalendlyTools(server, calendlyService);
  console.error("Calendly tools registered successfully");
} catch (error) {
  console.error("Failed to register Calendly tools:", error);
  process.exit(1);
}

// Create and connect the transport
const transport = new StdioServerTransport();

// Connect the server to the transport
server.connect(transport).catch((error) => {
  console.error("Failed to connect to transport:", error);
  process.exit(1);
});

console.error("MCP server started successfully");

// Handle process termination
process.on('SIGINT', () => {
  console.error("Shutting down MCP server...");
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error("Received SIGTERM. Shutting down...");
  process.exit(0);
});

// Keep the process alive
setInterval(() => {
  // Keep the process alive
}, 1000 * 60 * 60); // 1 hour