# Calendly Events API - Postman Collection

This directory contains a Postman collection for testing the Calendly Events API.

## Importing the Collection

1. Open Postman
2. Click on "Import" in the top-left corner
3. Select the `Calendly Events API.postman_collection.json` file
4. Click "Import"

## Using the Collection

The collection includes a single request for fetching Calendly events:

### Get Calendly Events
- **Method**: POST
- **URL**: `http://localhost:3000/api/calendly/events`
- **Headers**:
  - `Content-Type: application/json`
- **Body**:
  ```json
  {
    "apiKey": "your_calendly_api_key",
    "userUri": "your_calendly_user_uri",
    "status": "active",
    "count": 10,
    "sort": "start_time:asc"
  }
  ```

## Environment Setup

1. Create a new environment in Postman
2. Add the following variables:
   - `baseUrl`: `http://localhost:3000`
   - `apiKey`: Your Calendly API key
   - `userUri`: Your Calendly user URI

## Testing

1. Start the server: `npm run dev`
2. Open the Postman collection
3. Update the request body with your Calendly credentials
4. Click "Send" to test the endpoint

## Response

A successful response will return an array of Calendly events with details such as URIs, names, status, and scheduling information.

## Note

- Replace the placeholder values in the request body with your actual Calendly credentials
- The server must be running for the requests to work
- For security reasons, do not commit your actual API keys to version control
