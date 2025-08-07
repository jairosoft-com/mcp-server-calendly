# Calendly MCP Server - Docker Setup

This document explains how to deploy the Calendly MCP server using Docker, providing a containerized environment for managing Calendly scheduling through the Model Context Protocol.

## Prerequisites

- Docker and Docker Compose installed on your system
- Calendly API access token with appropriate scopes
- Calendly organization URI

## Quick Start with Docker Compose

The easiest way to get started is using Docker Compose:

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your configuration:
   ```
   AUTH_TOKEN=your_secure_auth_token
   CALENDLY_ACCESS_TOKEN=your_calendly_access_token
   CALENDLY_ORGANIZATION_URI=your_organization_uri
   NODE_ENV=production
   PORT=8787
   ```

3. Start the container:
   ```bash
   docker-compose up -d
   ```

## Building the Docker Image

To build the Docker image manually:

```bash
docker build -t mcp-calendly-server .
```

## Running the Container

### Basic Usage

```bash
docker run -d \
  --name mcp-calendly \
  -p 8787:8787 \
  --env-file .env \
  mcp-calendly-server
```

### Environment Variables

- `AUTH_TOKEN` (Required): Authentication token for the MCP server
- `CALENDLY_ACCESS_TOKEN` (Required): Your Calendly API access token
- `CALENDLY_ORGANIZATION_URI` (Required): Your Calendly organization URI
- `NODE_ENV`: `production` or `development` (default: `production`)
- `PORT`: Port the server listens on (default: `8787`)
- `LOG_LEVEL`: Logging level (default: `info`)

### Docker Compose Configuration

Example `docker-compose.yml` for production:

```yaml
version: '3.8'

services:
  mcp-calendly:
    image: mcp-calendly-server:latest
    container_name: mcp-calendly
    restart: unless-stopped
    ports:
      - "8787:8787"
    env_file:
      - .env
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Accessing the Server

- MCP Endpoint: `http://localhost:8787/mcp`
- Server-Sent Events: `http://localhost:8787/sse`
- Health Check: `http://localhost:8787/health`

## Monitoring and Logs

View container logs:
```bash
docker logs -f mcp-calendly
```

## Updating the Container

1. Pull the latest changes:
   ```bash
   git pull origin main
   ```

2. Rebuild and restart:
   ```bash
   docker-compose build --no-cache
   docker-compose up -d --force-recreate
   ```

## Development with Docker

For a development environment with hot-reloading:

1. Start the development container:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. The server will automatically restart when you make changes to the source code.

3. Access development tools:
   - API Docs: `http://localhost:8787/api-docs`
   - Debug Port: `9229` (for Node.js inspector)

## Security Best Practices

1. Always use HTTPS in production
2. Set appropriate file permissions:
   ```bash
   chmod 600 .env
   ```
3. Regularly update your Docker images:
   ```bash
   docker-compose pull
   ```
4. Use Docker secrets for sensitive data in production

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Verify the container is running: `docker ps`
   - Check logs: `docker logs mcp-calendly`

2. **Authentication Failures**
   - Verify `AUTH_TOKEN` matches your client configuration
   - Ensure `CALENDLY_ACCESS_TOKEN` has correct scopes

3. **Port Conflicts**
   - Check if port 8787 is already in use
   - Update the port mapping in `docker-compose.yml` if needed

## Support

For issues and feature requests, please open an issue on our [GitHub repository](https://github.com/your-org/mcp-server-calendly).
