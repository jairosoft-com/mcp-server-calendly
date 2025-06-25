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

// Test function to fetch and display events
async function testFetchEvents() {
  try {
    console.log('Fetching Calendly events...');
    
    // Get current user info
    console.log('Fetching user info...');
    const user = await calendlyService.getCurrentUser();
    console.log(`Logged in as: ${user.name} (${user.email})`);
    
    // Fetch active events for the current user
    console.log('\nFetching active events...');
    const eventsResponse = await calendlyService.fetchEvents(user.uri, 'active');
    const events = eventsResponse.collection;
    
    if (!events || events.length === 0) {
      console.log('No active scheduled events found.');
      return;
    }
    
    console.log(`\nFound ${events.length} active events. Fetching details...`);
    
    // Process each event to get invitees
    const tableData = [];
    
    for (const [index, event] of events.entries()) {
      const eventId = calendlyService.extractEventId(event.uri);
      
      // Get invitees for this event
      const invitees = await calendlyService.getEventInvitees(eventId);
      const emails = invitees
        .map(invitee => invitee.email)
        .filter(Boolean)
        .join(', ') || 'None';
      
      // Add event data to table
      tableData.push([
        index + 1,
        event.name,
        new Date(event.start_time).toLocaleString(),
        new Date(event.end_time).toLocaleString(),
        event.status,
        event.uri,
        event.event_type,
        emails
      ]);
    }
    
    // Display results in a table
    console.log('\n=== Calendly Events ===');
    console.table(tableData, [
      '#', 'Event', 'Start Time', 'End Time', 'Status', 'URI', 'Event Type', 'Attendees'
    ]);
    
  } catch (error) {
    console.error('\nError testing Calendly service:');
    console.error(error instanceof Error ? error.message : String(error));
    
    // Log additional error details if available
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as any).response;
      if (response) {
        console.error('Response status:', response.status);
        try {
          const errorData = await response.json();
          console.error('Error details:', JSON.stringify(errorData, null, 2));
        } catch (e) {
          console.error('Could not parse error response');
        }
      }
    }
  }
}

// Run the test
console.log('Starting Calendly API test...');
testFetchEvents().catch(error => {
  console.error('Unhandled error in test:', error);
  process.exit(1);
});
