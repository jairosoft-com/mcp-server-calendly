import { z } from "zod";
import { 
    CalendlyErrorResponse, 
    CalendlyEventsResponse, 
    CalendlyUserResponse, 
    CalendlyInvitee, 
    CalendlyInviteesResponse 
} from "../interface/calendlyInterfaces";



// Shared authentication token
let currentAuthToken: string | undefined;

// Function to set the authentication token
export function setAuthToken(token: string | undefined) {
    currentAuthToken = token;
}

export function getCalendlyEvents() {
    return {
        name: "getCalendlyEvents",
        schema: {
            startDateTime: z.string().describe("Start date and time in ISO 8601 format (e.g., 2023-01-01T00:00:00)"),
            endDateTime: z.string().describe("End date and time in ISO 8601 format (e.g., 2023-01-31T23:59:59)"),
        },
        handler: async ({ startDateTime, endDateTime }: { startDateTime: string; endDateTime: string }) => {
            try {
                if (!currentAuthToken) {
                    throw new Error("Calendly personal access token not found. Please set the AUTH_TOKEN environment variable.");
                }

                // First, get the current user's URI
                const userResponse = await fetch('https://api.calendly.com/users/me', {
                    headers: {
                        'Authorization': `Bearer ${currentAuthToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!userResponse.ok) {
                    const errorData = await userResponse.json() as CalendlyErrorResponse;
                    throw new Error(`Calendly API error: ${errorData?.message || userResponse.statusText}`);
                }

                const userData = await userResponse.json() as CalendlyUserResponse;
                const userUri = userData.resource.uri;

                // Now fetch events for the user
                const url = new URL('https://api.calendly.com/scheduled_events');
                url.searchParams.append('user', userUri);
                url.searchParams.append('min_start_time', startDateTime);
                url.searchParams.append('max_start_time', endDateTime);
                url.searchParams.append('status', 'active');
                url.searchParams.append('count', '100');

                const eventsResponse = await fetch(url.toString(), {
                    headers: {
                        'Authorization': `Bearer ${currentAuthToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!eventsResponse.ok) {
                    const errorData = await eventsResponse.json() as CalendlyErrorResponse;
                    throw new Error(`Calendly API error: ${errorData?.message || eventsResponse.statusText}`);
                }

                const eventsData = await eventsResponse.json() as CalendlyEventsResponse;

                // Process each event to get invitees
                const eventsWithInvitees = await Promise.all(eventsData.collection.map(async (event) => {
                    // Get the event ID from the URI (last part of the URI)
                    const eventId = event.uri.split('/').pop();
                    let invitees: Array<{
                        name: string;
                        email: string;
                        status: string;
                        questions_and_answers: Array<{ question: string; answer: string }>;
                        timezone: string;
                        created_at: string;
                        updated_at: string;
                    }> = [];
                    
                    try {
                        // Fetch invitees for this event
                        const inviteesUrl = new URL(`https://api.calendly.com/scheduled_events/${eventId}/invitees`);
                        inviteesUrl.searchParams.append('count', '100');
                        
                        const inviteesResponse = await fetch(inviteesUrl.toString(), {
                            headers: {
                                'Authorization': `Bearer ${currentAuthToken}`,
                                'Content-Type': 'application/json',
                            },
                        });

                        if (inviteesResponse.ok) {
                            const inviteesData = await inviteesResponse.json() as CalendlyInviteesResponse;
                            invitees = inviteesData.collection.map((invitee) => ({
                                name: invitee.name || 'No name',
                                email: invitee.email || 'No email',
                                status: invitee.status || 'unknown',
                                questions_and_answers: invitee.questions_and_answers || [],
                                timezone: invitee.timezone || 'Not specified',
                                created_at: invitee.created_at,
                                updated_at: invitee.updated_at
                            }));
                        }
                    } catch (error) {
                        console.error(`Error fetching invitees for event ${eventId}:`, error);
                        // Continue with empty invitees array if there's an error
                    }

                    return {
                        name: event.name || 'No name',
                        status: event.status || 'unknown',
                        start_time: event.start_time || 'No start time',
                        end_time: event.end_time || 'No end time',
                        event_type: event.event_type || 'No event type',
                        location: event.location?.location || 'No location',
                        location_type: event.location?.type || 'unknown',
                        invitees_count: invitees.length,
                        invitees: invitees,
                        created_at: event.created_at,
                        updated_at: event.updated_at
                    };
                }));

                return {
                    content: [{
                        type: "text" as const,
                        text: eventsWithInvitees.length > 0 
                            ? JSON.stringify(eventsWithInvitees, null, 2)
                            : "No Calendly events found in the specified date range.",
                        _meta: {}
                    }]
                };

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                return {
                    content: [{
                        type: "text" as const,
                        text: `Error fetching Calendly events: ${errorMessage}`,
                        _meta: {}
                    }],
                    isError: true
                };
            }
        }
    };
}
