import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Env } from "./interface/calendlyInterfaces";
import { getCalendlyEvents } from "./tools/calendlyTools";

// Define the Props type
type Props = {
	bearerToken: string;
};

// Define our MCP agent with tools
export class MyMCP extends McpAgent<Env, null, Props>  {
	server = new McpServer({
		name: "Calendly Events Fetcher",
		version: "1.0.0",
	});

	async init() {
		// Access token from this.props.bearerToken
		const token = this.props.bearerToken;

		// Get tool definitions by calling the factory functions
		const getEventsTool = getCalendlyEvents(token);

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
		const authHeader = request.headers.get("authorization");
        const tokenFromUrl = url.searchParams.get('token');
		const authToken = (authHeader?.replace("Bearer ", "") || tokenFromUrl || env.AUTH_TOKEN || "").trim();
        
        console.log('Auth token received:', authToken ? `${authToken.substring(0, 10)}...` : 'No token found');
		
		ctx.props = {
			bearerToken: authToken
		};

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};