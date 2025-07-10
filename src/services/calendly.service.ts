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
  private readonly apiKey: string;
  private readonly defaultHeaders: Record<string, string>;

  /**
   * Creates a new instance of the CalendlyService
   * @param apiKey The Calendly API key (personal access token)
   */
  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Calendly API key is required');
    }
    
    this.apiKey = apiKey;
    this.defaultHeaders = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Fetches the current user's information
   * @returns A promise that resolves to the current user's information
   */
  public async getCurrentUser(): Promise<CalendlyUser> {
    try {
      const response = await fetch(`${this.baseUrl}/users/me`, {
        method: 'GET',
        headers: this.defaultHeaders,
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
   * @param userUri The URI of the user to fetch events for
   * @param status The status of events to fetch (e.g., 'active')
   * @returns A promise that resolves to the events response
   */
  public async fetchEvents(userUri: string, status = 'active'): Promise<CalendlyEventsResponse> {
    try {
      const params = new URLSearchParams({
        user: userUri,
        status: status,
        count: '100' // Max allowed by API
      });

      const url = `${this.baseUrl}/scheduled_events?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.defaultHeaders,
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
   * @param eventId The ID of the event to fetch invitees for
   * @returns A promise that resolves to the list of invitees
   */
  public async getEventInvitees(eventId: string): Promise<CalendlyInvitee[]> {
    try {
      const url = `${this.baseUrl}/scheduled_events/${eventId}/invitees`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.defaultHeaders,
      });

      if (!response.ok) {
        const errorData: CalendlyErrorResponse = await response.json();
        throw new Error(`Failed to fetch event invitees: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      return data.collection as CalendlyInvitee[];
    } catch (error) {
      console.error(`Error fetching invitees for event ${eventId}:`, error);
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
