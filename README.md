# Calendly Events API

A simple REST API for fetching Calendly events with stateless authentication.

## Features

- Single endpoint for fetching Calendly events
- Stateless authentication (API key in request body)
- Built with TypeScript and Express
- Environment variable configuration

## Prerequisites

- Node.js 16.x or later
- npm 7.x or later
- A Calendly API key

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/calendly-events-api.git
   cd calendly-events-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server

### Development Mode

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## API Endpoint

### Get Calendly Events

```http
POST /api/calendly/events
```

**Request Body:**
```json
{
  "apiKey": "your_calendly_api_key",
  "userUri": "your_calednly_user_uri",
  "status": "active",
  "count": 20,
  "sort": "start_time:asc"
}
```

**Parameters:**
- `apiKey` (required): Your Calendly API key
- `userUri` (required): Your Calendly user URI
- `status` (optional): Filter events by status (`active`, `canceled`, or `all`)
- `count` (optional): Number of events to return (default: 20, max: 100)
- `sort` (optional): Sort order (`start_time:asc` or `start_time:desc`)

**Example Response:**
```json
{
  "collection": [
    {
      "uri": "https://api.calendly.com/event_types/ABC123",
      "name": "15 Minute Meeting",
      "active": true,
      "scheduling_url": "https://calendly.com/yourname/15min"
    }
  ],
  "pagination": {
    "count": 1,
    "next_page": null
  }
}
```

## Environment Variables

- `PORT` - Port to run the server on (default: 3000)
- `NODE_ENV` - Environment (development/production)

## License

MIT
