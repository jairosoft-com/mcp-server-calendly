import type { 
  FetchEventsParams, 
  CalendlyEventsResponse, 
  CalendlyErrorResponse,
  CalendlyEvent 
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
   * Fetches events from the Calendly API
   * @param params Query parameters for filtering events
   * @returns A promise that resolves to the events response
   */
  public async fetchEvents(params?: FetchEventsParams): Promise<CalendlyEventsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      // Set default parameters
      queryParams.append('count', String(params?.count || 20));
      
      // Add query parameters if provided
      if (params) {
        if (params.min_start_time) {
          queryParams.append('sort', 'start_time:asc');
          queryParams.append('min_start_time', new Date(params.min_start_time).toISOString());
        }
        
        if (params.max_start_time) {
          queryParams.append('max_start_time', new Date(params.max_start_time).toISOString());
        }
        
        if (params.user) {
          queryParams.append('user', params.user);
        }
        
        if (params.event_type) {
          queryParams.append('event_type', params.event_type);
        }
        
        if (params.organization) {
          queryParams.append('organization', params.organization);
        }
        
        if (params.page_token) {
          queryParams.append('page_token', params.page_token);
        }
      }

      const url = `${this.baseUrl}/scheduled_events?${queryParams.toString()}`;
      
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
   * Fetches a specific event by its URI
   * @param eventUri The URI of the event to fetch
   * @returns A promise that resolves to the event details
   */
  public async getEvent(eventUri: string): Promise<CalendlyEvent> {
    try {
      const response = await fetch(eventUri, {
        method: 'GET',
        headers: this.defaultHeaders,
      });

      if (!response.ok) {
        const errorData: CalendlyErrorResponse = await response.json();
        throw new Error(`Calendly API error: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      return data.resource as CalendlyEvent;
    } catch (error) {
      console.error(`Error fetching Calendly event ${eventUri}:`, error);
      throw new Error(`Failed to fetch Calendly event: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
