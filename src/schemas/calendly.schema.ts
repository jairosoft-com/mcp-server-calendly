import { z } from 'zod';

/**
 * Schema for validating event location objects
 */
export const eventLocationSchema = z.object({
  type: z.string(),
  location: z.string(),
});

/**
 * Schema for validating event invitee counters
 */
export const inviteesCounterSchema = z.object({
  total: z.number(),
  active: z.number(),
  limit: z.number(),
});

/**
 * Schema for validating a Calendly event
 */
export const calendlyEventSchema = z.object({
  uri: z.string().url(),
  name: z.string(),
  status: z.enum(['active', 'canceled', 'completed', 'incomplete', 'tentative', 'not_started']),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  event_type: z.string().url(),
  location: eventLocationSchema,
  invitees_counter: inviteesCounterSchema,
  created_by: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

/**
 * Schema for validating pagination information
 */
export const paginationSchema = z.object({
  count: z.number(),
  next_page: z.string().url().optional(),
  previous_page: z.string().url().optional(),
  next_page_token: z.string().optional(),
});

/**
 * Schema for validating the events response
 */
export const calendlyEventsResponseSchema = z.object({
  collection: z.array(calendlyEventSchema),
  pagination: paginationSchema,
});

/**
 * Schema for validating fetch events parameters
 */
export const fetchEventsParamsSchema = z.object({
  count: z.number().min(1).max(100).optional(),
  page_token: z.string().optional(),
  min_start_time: z.string().datetime().optional(),
  max_start_time: z.string().datetime().optional(),
  user: z.string().url().optional(),
  event_type: z.string().url().optional(),
  organization: z.string().url().optional(),
  sort: z.enum(['start_time:asc', 'start_time:desc']).optional(),
}).refine(
  (data) => {
    if (data.min_start_time && data.max_start_time) {
      return new Date(data.min_start_time) <= new Date(data.max_start_time);
    }
    return true;
  },
  {
    message: 'min_start_time must be before or equal to max_start_time',
    path: ['min_start_time'],
  }
);

/**
 * Schema for validating error details
 */
export const errorDetailSchema = z.object({
  field: z.string(),
  message: z.string(),
});

/**
 * Schema for validating error responses
 */
export const calendlyErrorResponseSchema = z.object({
  title: z.string(),
  message: z.string(),
  status: z.number(),
  details: z.array(errorDetailSchema).optional(),
});

// Export types inferred from the schemas
export type CalendlyEvent = z.infer<typeof calendlyEventSchema>;
export type CalendlyEventsResponse = z.infer<typeof calendlyEventsResponseSchema>;
export type FetchEventsParams = z.infer<typeof fetchEventsParamsSchema>;
export type CalendlyErrorResponse = z.infer<typeof calendlyErrorResponseSchema>;
