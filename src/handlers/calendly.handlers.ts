import { Request, Response } from 'express';
import { CalendlyService } from '../services/calendly.service.js';
import { z } from 'zod';

// Schema for validating the fetch events request body
const fetchEventsSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  userUri: z.string().min(1, 'User URI is required'),
  status: z.enum(['active', 'canceled', 'all']).optional().default('active'),
  count: z.number().int().positive().max(100).optional().default(20),
  sort: z.enum(['start_time:asc', 'start_time:desc']).optional().default('start_time:asc')
});

/**
 * Handler for fetching Calendly events
 * @param req Express request object
 * @param res Express response object
 */
export const getCalendlyEvents = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const params = fetchEventsSchema.parse(req.body);
    
    // Create a new instance of the service with the provided API key
    const calendlyService = new CalendlyService();
    
    // Fetch events using the service
    const events = await calendlyService.fetchEvents(
      params.apiKey,
      params.userUri,
      params.status,
      params.count,
      params.sort
    );
    
    return res.status(200).json(events);
  } catch (error) {
    console.error('Error in getCalendlyEvents:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }
    return res.status(500).json({
      error: 'Failed to fetch Calendly events',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Handler for getting the current Calendly user
 * @param req Express request object
 * @param res Express response object
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({
        error: 'API key is required in request body'
      });
    }
    
    // Create a new instance of the service
    const calendlyService = new CalendlyService();
    
    // Get the current user using the provided API key
    const user = await calendlyService.getCurrentUser(apiKey);
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return res.status(500).json({
      error: 'Failed to fetch Calendly user',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Handler for getting event invitees
 * @param req Express request object
 * @param res Express response object
 */
export const getEventInvitees = async (req: Request, res: Response) => {
  try {
    const { apiKey, eventUuid } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({
        error: 'API key is required in request body'
      });
    }
    
    if (!eventUuid) {
      return res.status(400).json({
        error: 'eventUuid is required in request body'
      });
    }
    
    // Create a new instance of the service
    const calendlyService = new CalendlyService();
    
    // Get the event invitees using the provided API key
    const invitees = await calendlyService.getEventInvitees(apiKey, eventUuid);
    return res.status(200).json(invitees);
  } catch (error) {
    console.error('Error in getEventInvitees:', error);
    return res.status(500).json({
      error: 'Failed to fetch event invitees',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
