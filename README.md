# Calendly MCP Server

This is a Model Context Protocol (MCP) server that integrates with Calendly's API, allowing AI assistants to manage Calendly events, availability, and scheduling programmatically.

## Prerequisites

- Node.js 16+ and npm
- Docker (for containerized deployment)
- Calendly API access token
- Calendly organization URI

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/mcp-server-calendly.git
   cd mcp-server-calendly
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory with:
   ```
   AUTH_TOKEN=your_secure_auth_token
   CALENDLY_ACCESS_TOKEN=your_calendly_access_token
   CALENDLY_ORGANIZATION_URI=your_organization_uri
   NODE_ENV=development
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Available Calendly Tools

This MCP server provides the following Calendly integration tools:

- **List Events**: Retrieve a list of scheduled events
- **Get Event Details**: Get detailed information about a specific event
- **List Event Types**: View available event types
- **Check Availability**: Check availability for scheduling
- **Create Event**: Schedule a new event
- **Cancel Event**: Cancel an existing event

### Example Usage with Claude

You can ask Claude to interact with your Calendly instance:

```
Please check my availability for a 30-minute meeting next Tuesday.
```

```
Schedule a meeting with jane@example.com for next Wednesday at 2pm using my "30 Minute Meeting" event type.
```

## Security Considerations

- Always use HTTPS in production
- Keep your `AUTH_TOKEN` and `CALENDLY_ACCESS_TOKEN` secure
- Set appropriate scopes for your Calendly access token
- Regularly rotate your access tokens
- Use environment variables for sensitive information

## Connecting Claude Desktop

To connect Claude Desktop to your Calendly MCP server:

1. Follow [Anthropic's Quickstart](https://modelcontextprotocol.io/quickstart/user)
2. In Claude Desktop, go to Settings > Developer > Edit Config
3. Add your MCP server configuration:

```json
{
  "mcpServers": {
    "calendly": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:8787/sse?token=your-auth-token"
      ]
    }
  }
}
```

4. Restart Claude Desktop
5. The Calendly tools should now be available in your conversation

## Troubleshooting

- **Connection Issues**: Verify your server is running and accessible
- **Authentication Errors**: Check your `AUTH_TOKEN` and Calendly access token
- **Permission Issues**: Ensure your Calendly token has the necessary scopes
- **Logs**: Check server logs for detailed error messages

## License

[MIT License](LICENSE)
