// Types for Calendly API responses
export interface CalendlyUserResponse {
    resource: {
      uri: string;
      name: string;
      email: string;
      scheduling_url: string;
      timezone: string;
      avatar_url: string;
      created_at: string;
      updated_at: string;
    };
  }
  
export interface CalendlyEvent {
uri: string;
name: string;
status: string;
start_time: string;
end_time: string;
event_type: string;
location?: {
    type: string;
    location: string;
};
invitees_counter?: {
    total: number;
    active: number;
    limit: number;
};
created_at: string;
updated_at: string;
}

export interface CalendlyEventsResponse {
collection: CalendlyEvent[];
pagination: {
    count: number;
    next_page?: string;
    previous_page?: string;
    next_page_token?: string;
};
}

export interface CalendlyErrorResponse {
message?: string;
details?: Array<{
    message: string;
    parameter: string;
}>;
}

export interface CalendlyInvitee {
    uri: string;
    name: string;
    email: string;
    status: string;
    questions_and_answers?: Array<{
        question: string;
        answer: string;
    }>;
    timezone: string;
    created_at: string;
    updated_at: string;
}

export interface CalendlyInviteesResponse {
    collection: CalendlyInvitee[];
    pagination: {
        count: number;
        next_page?: string;
        previous_page?: string;
        next_page_token?: string;
    };
}

export interface Env {
    AUTH_TOKEN?: string;
}