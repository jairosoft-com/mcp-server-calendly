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
const calendlyService = new CalendlyService(apiKey);

// Register Calendly tools
registerCalendlyTools(server, calendlyService);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Calendly MCP server started");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});