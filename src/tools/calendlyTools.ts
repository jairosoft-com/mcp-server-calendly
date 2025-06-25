import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CalendlyService } from '../services/calendly.service.js';
import type { FetchEventsParams, CalendlyEvent } from '../interfaces/calendly.interface.js'; // Removed unused CalendlyEventsResponse

/**
 * Formats a date string to a more readable format
 * @param dateString ISO date string
 * @returns Formatted date and time string
 */
function formatDateTime(dateString: string): string {
  if (!dateString) return 'Not specified';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
}

/**
 * Gets the status text with appropriate emoji
 * @param status The event status
 * @returns Formatted status text with emoji
 */
function getStatusWithEmoji(status: string): string {
  const statusMap: Record<string, string> = {
    'active': '🟢 Active',
    'canceled': '🔴 Canceled',
    'completed': '✅ Completed',
    'incomplete': '🟡 Incomplete',
    'tentative': '🟠 Tentative',
    'not_started': '⏳ Not Started'
  };
  return statusMap[status] || status;
}

/**
 * Formats a list of Calendly events into a markdown table
 * @param events List of Calendly events
 * @returns Formatted markdown table of events
 */
function formatEvents(events: CalendlyEvent[]): string {
  if (events.length === 0) {
    return 'No upcoming events found.';
  }

  // Table header
  let table = '| # | Event | Status | When | Location |\n';
  table += '| --- | --- | --- | --- | --- |\n';

  // Add each event as a row
  events.forEach((event, index) => {
    const eventName = event.name || 'Untitled Event';
    const status = getStatusWithEmoji(event.status);
    const when = `${formatDateTime(event.start_time)} - ${formatDateTime(event.end_time).split(' ').pop()}`;
    const location = event.location?.location || 'Not specified';
    
    table += `| ${index + 1} `;  // Row number
    table += `| **${eventName}** `;  // Event name
    table += `| ${status} `;  // Status
    table += `| ${when} `;  // When
    table += `| ${location} `;  // Location
    table += '|\n';  // End of row
  });

  // Add a summary at the top
  const summary = `## 📅 Upcoming Calendly Events (${events.length} events)\n\n`;
  
  return summary + table;
}

/**
 * Fetches Calendly events based on the provided parameters
 * @param params Query parameters for filtering events
 * @param calandlyService Instance of CalendlyService
 * @returns Formatted string with the events information
 */
async function fetchCalendlyEvents(
  params: FetchEventsParams,
  calandlyService: CalendlyService
): Promise<string> {
  try {
    const response = await calandlyService.fetchEvents(params);
    return formatEvents(response.collection);
  } catch (error) {
    console.error('Error in fetchCalendlyEvents:', error);
    throw new Error(`Failed to fetch Calendly events: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Registers the Calendly tools with the MCP server
 * @param server The MCP server instance
 * @param calandlyService Instance of CalendlyService
 */
export function registerCalendlyTools(server: McpServer, calandlyService: CalendlyService): void {
  // Register the fetchCalendlyEvents tool
  server.tool(
    'fetch_calendly_events',
    {
      description: 'Fetches upcoming Calendly events',
      parameters: {
        type: 'object',
        properties: {
          count: {
            type: 'number',
            description: 'Number of events to return (default: 10, max: 100)',
            minimum: 1,
            maximum: 100
          },
          min_start_time: {
            type: 'string',
            format: 'date-time',
            description: 'Filter events with start time after this datetime (ISO 8601 format)'
          },
          max_start_time: {
            type: 'string',
            format: 'date-time',
            description: 'Filter events with start time before this datetime (ISO 8601 format)'
          },
          event_type: {
            type: 'string',
            description: 'Filter events by event type URI'
          },
          user: {
            type: 'string',
            description: 'Filter events by user URI'
          },
          organization: {
            type: 'string',
            description: 'Filter events by organization URI'
          },
          sort: {
            type: 'string',
            enum: ['start_time:asc', 'start_time:desc'],
            description: 'Sort order for events (default: start_time:asc)'
          }
        },
        additionalProperties: false
      },
      required: []
    },
    async (params: FetchEventsParams) => {
      const result = await fetchCalendlyEvents(params, calandlyService);
      return {
        content: [{
          type: 'text',
          text: result
        }]
      };
    }
  );
}

export default {
  registerCalendlyTools,
  fetchCalendlyEvents
};
