/**
 * Interfaces for Calendly API responses and related types
 */

export interface CalendlyEvent {
  /**
   * The unique identifier for the event
   */
  uri: string;
  
  /**
   * The name of the event
   */
  name: string;
  
  /**
   * The current status of the event (active, canceled, etc.)
   */
  status: 'active' | 'canceled' | 'completed' | 'incomplete' | 'tentative' | 'not_started';
  
  /**
   * The start time of the event in ISO 8601 format
   */
  start_time: string;
  
  /**
   * The end time of the event in ISO 8601 format
   */
  end_time: string;
  
  /**
   * The event type URI
   */
  event_type: string;
  
  /**
   * Information about the event location
   */
  location: {
    /**
     * The type of location (e.g., 'physical', 'outbound_call', 'inbound_call', 'google_conference', 'zoom_conference')
     */
    type: string;
    
    /**
     * The location details (e.g., physical address, meeting URL, phone number)
     */
    location: string;
  };
  
  /**
   * The event invitees
   */
  invitees_counter: {
    total: number;
    active: number;
    limit: number;
  };
  
  /**
   * The event creator's information
   */
  created_by: string;
  
  /**
   * The time the event was created in ISO 8601 format
   */
  created_at: string;
  
  /**
   * The time the event was last updated in ISO 8601 format
   */
  updated_at: string;
}

export interface CalendlyEventsResponse {
  /**
   * The list of events
   */
  collection: CalendlyEvent[];
  
  /**
   * Pagination information
   */
  pagination: {
    /**
     * The number of items per page
     */
    count: number;
    
    /**
     * The next page URL, if available
     */
    next_page?: string;
    
    /**
     * The previous page URL, if available
     */
    previous_page?: string;
    
    /**
     * The next page cursor for pagination
     */
    next_page_token?: string;
  };
}

export interface CalendlyUser {
  /**
   * The user's unique identifier URI
   */
  uri: string;
  
  /**
   * The user's name
   */
  name: string;
  
  /**
   * The user's email address
   */
  email: string;
  
  /**
   * The user's scheduling URL
   */
  scheduling_url: string;
  
  /**
   * The user's timezone
   */
  timezone: string;
  
  /**
   * The user's avatar URL
   */
  avatar_url: string;
  
  /**
   * The user's current organization URI
   */
  current_organization: string;
  
  /**
   * The time the user was created
   */
  created_at: string;
  
  /**
   * The time the user was last updated
   */
  updated_at: string;
}

export interface CalendlyInvitee {
  /**
   * The invitee's email address
   */
  email: string;
  
  /**
   * The invitee's name
   */
  name: string;
  
  /**
   * The invitee's status
   */
  status: 'active' | 'canceled' | 'completed' | 'processing' | 'no_show';
  
  /**
   * The time the invitee was created
   */
  created_at: string;
  
  /**
   * The time the invitee was last updated
   */
  updated_at: string;
  
  /**
   * The URI of the event the invitee is associated with
   */
  event: string;
  
  /**
   * The questions and answers provided by the invitee
   */
  questions_and_answers?: Array<{
    question: string;
    answer: string;
    position: number;
  }>;
  
  /**
   * The invitee's timezone
   */
  timezone?: string;
  
  /**
   * The invitee's rescheduled from event URI if this is a rescheduled event
   */
  rescheduled_from?: string;
  
  /**
   * The invitee's reschedule event URI if this invitee rescheduled
   */
  reschedule_event?: string;
}

export interface FetchEventsParams {
  /**
   * The user URI to fetch events for (required)
   */
  user: string;
  
  /**
   * The status of events to fetch (e.g., 'active', 'canceled')
   * @default 'active'
   */
  status?: string;
  
  /**
   * The number of records to return (default: 20, max: 100)
   */
  count?: number;
  
  /**
   * The token to retrieve a specific page of results
   */
  page_token?: string;
  
  /**
   * The lower bound of the date range to filter events by (ISO 8601 format)
   */
  min_start_time?: string;
  
  /**
   * The upper bound of the date range to filter events by (ISO 8601 format)
   */
  max_start_time?: string;
  
  /**
   * The event type URI to filter events by
   */
  event_type?: string;
  
  /**
   * The organization URI to filter events by
   */
  organization?: string;
  
  /**
   * The sort order for the events (default: 'start_time:asc')
   */
  sort?: 'start_time:asc' | 'start_time:desc';
}

export interface CalendlyErrorResponse {
  /**
   * The error title
   */
  title: string;
  
  /**
   * The error message
   */
  message: string;
  
  /**
   * The HTTP status code
   */
  status: number;
  
  /**
   * Additional error details
   */
  details?: Array<{
    /**
     * The field that caused the error
     */
    field: string;
    
    /**
     * The error message for this field
     */
    message: string;
  }>;
}
