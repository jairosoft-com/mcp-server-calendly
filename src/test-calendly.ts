import dotenv from 'dotenv';
import { CalendlyService } from './services/calendly.service.js';

// Load environment variables
dotenv.config();

// Check if CALENDLY_PERSONAL_ACCESS_TOKEN is set
const apiKey = process.env.CALENDLY_PERSONAL_ACCESS_TOKEN;
if (!apiKey) {
  console.error('Error: CALENDLY_PERSONAL_ACCESS_TOKEN environment variable is not set');
  process.exit(1);
}

// Create a new instance of the CalendlyService
const calendlyService = new CalendlyService(apiKey);

// Test function to fetch events
async function testFetchEvents() {
  try {
    console.log('Fetching Calendly events...');
    
    // First, we need to get the current user's organization URI
    // This is required for the events endpoint
    const userInfoResponse = await fetch('https://api.calendly.com/users/me', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!userInfoResponse.ok) {
      const errorData = await userInfoResponse.json();
      throw new Error(`Failed to fetch user info: ${errorData.message || userInfoResponse.statusText}`);
    }
    
    const userInfo = await userInfoResponse.json();
    const userUri = userInfo.resource.uri;
    const organizationUri = userInfo.resource.current_organization;
    
    console.log('User URI:', userUri);
    console.log('Organization URI:', organizationUri);
    
    // Fetch events from the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Include both user and organization URIs as required by the API
    const events = await calendlyService.fetchEvents({
      user: userUri,
      organization: organizationUri,
      min_start_time: oneWeekAgo.toISOString(),
      count: 5 // Limit to 5 events for testing
    });
    
    console.log('Successfully fetched events:');
    console.log(JSON.stringify(events, null, 2));
    
    // If we have events, try to fetch the first event's details
    if (events.collection && events.collection.length > 0) {
      const firstEvent = events.collection[0];
      console.log('\nFetching details for event:', firstEvent.uri);
      
      const eventDetails = await calendlyService.getEvent(firstEvent.uri);
      console.log('\nEvent details:');
      console.log(JSON.stringify(eventDetails, null, 2));
    }
    
  } catch (error) {
    console.error('Error testing Calendly service:');
    console.error(error instanceof Error ? error.message : String(error));
    
    // Log additional error details if available
    if (error instanceof Error && 'response' in error) {
      const response = (error as any).response;
      if (response) {
        console.error('Response status:', response.status);
        console.error('Response data:', response.data);
      }
    }
    
    process.exit(1);
  }
}

// Run the test
console.log('Starting Calendly API test...');
testFetchEvents().catch(error => {
  console.error('Unhandled error in test:', error);
  process.exit(1);
});
