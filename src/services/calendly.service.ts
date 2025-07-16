import type { 
  CalendlyEventsResponse, 
  CalendlyErrorResponse,
  CalendlyUser,
  CalendlyInvitee
} from '../interfaces/calendly.interface.js';

/**
 * Service for interacting with the Calendly API
 */
export class CalendlyService {
  private readonly baseUrl = 'https://api.calendly.com';

  /**
   * Creates a new instance of the CalendlyService
   */
  constructor() {
    // No initialization needed as we'll get API key per request
  }

  /**
   * Get headers with the provided API key
   * @param apiKey The Calendly API key (personal access token)
   */
  private getHeaders(apiKey: string): Record<string, string> {
    if (!apiKey) {
      throw new Error('Calendly API key is required for this request');
    }
    
    return {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Fetches the current user's information
   * @param apiKey The Calendly API key (personal access token)
   * @returns A promise that resolves to the current user's information
   */
  public async getCurrentUser(apiKey: string): Promise<CalendlyUser> {
    try {
      const response = await fetch(`${this.baseUrl}/users/me`, {
        method: 'GET',
        headers: this.getHeaders(apiKey),
      });

      if (!response.ok) {
        const errorData: CalendlyErrorResponse = await response.json();
        throw new Error(`Failed to fetch user info: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      return data.resource as CalendlyUser;
    } catch (error) {
      console.error('Error fetching Calendly user info:', error);
      throw new Error(`Failed to fetch Calendly user info: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Fetches events from the Calendly API
   * @param apiKey The Calendly API key (personal access token)
   * @param userUri The URI of the user to fetch events for
   * @param status The status of events to fetch (e.g., 'active')
   * @param count The number of events to fetch
   * @param sort The sort order of events
   * @returns A promise that resolves to the events response
   */
  public async fetchEvents(
    apiKey: string,
    userUri: string,
    status: 'active' | 'canceled' | 'all' = 'active',
    count: number = 20,
    sort: 'start_time:asc' | 'start_time:desc' = 'start_time:asc'
  ): Promise<CalendlyEventsResponse> {
    try {
      const params = new URLSearchParams({
        user: userUri,
        status: status,
        count: String(count),
        sort: sort
      });

      const url = `${this.baseUrl}/scheduled_events?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(apiKey),
      });

      if (!response.ok) {
        const errorData: CalendlyErrorResponse = await response.json();
        throw new Error(`Calendly API error: ${errorData.message || response.statusText}`);
      }

      return await response.json() as CalendlyEventsResponse;
    } catch (error) {
      console.error('Error fetching Calendly events:', error);
      throw new Error(`Failed to fetch Calendly events: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Fetches invitees for a specific event
   * @param apiKey The Calendly API key (personal access token)
   * @param eventUuid The UUID of the event to fetch invitees for
   * @param count The number of invitees to fetch
   * @param status The status of invitees to fetch
   * @returns A promise that resolves to the list of invitees
   */
  public async getEventInvitees(
    apiKey: string,
    eventUuid: string,
    count: number = 100,
    status: 'active' | 'canceled' | 'all' = 'all'
  ): Promise<CalendlyInvitee[]> {
    try {
      const params = new URLSearchParams({
        count: String(count),
        status: status
      });

      const url = `${this.baseUrl}/scheduled_events/${eventUuid}/invitees?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(apiKey),
      });

      if (!response.ok) {
        const errorData: CalendlyErrorResponse = await response.json();
        throw new Error(`Failed to fetch event invitees: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      return data.collection as CalendlyInvitee[];
    } catch (error) {
      console.error(`Error fetching invitees for event ${eventUuid}:`, error);
      throw new Error(`Failed to fetch event invitees: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Extracts the event ID from a Calendly event URI
   * @param eventUri The event URI (e.g., 'https://api.calendly.com/scheduled_events/ABC123')
   * @returns The event ID (e.g., 'ABC123')
   */
  public extractEventId(eventUri: string): string {
    const parts = eventUri.split('/');
    return parts[parts.length - 1];
  }
}
