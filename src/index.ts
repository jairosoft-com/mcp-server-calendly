import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Env } from "./interface/calendlyInterfaces";
import { setAuthToken, getCalendlyEvents } from "./tools/calendlyTools";

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Calendly Events Fetcher",
		version: "1.0.0",
	});

	async init() {
		// Get tool definitions by calling the factory functions
		const getEventsTool = getCalendlyEvents();

		// Register the getCalendarEvents tool
		this.server.tool(
			getEventsTool.name,
			getEventsTool.schema,
			getEventsTool.handler
		);

    }
}

export default {
    fetch(request: Request, env: Env, ctx: ExecutionContext) {
        const url = new URL(request.url);
        const tokenFromUrl = url.searchParams.get('token');
        const authToken = tokenFromUrl || env.AUTH_TOKEN;
        
        console.log('Auth token received:', authToken ? `${authToken.substring(0, 10)}...` : 'No token found');
		
		setAuthToken(authToken);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};