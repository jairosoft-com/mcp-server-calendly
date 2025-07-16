import { Router } from 'express';
import * as calendlyHandlers from '../handlers/calendly.handlers.js';

const router = Router();

/**
 * @openapi
 * /api/calendly/events:
 *   post:
 *     summary: Fetch Calendly events
 *     description: Fetches events from Calendly API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - apiKey
 *               - userUri
 *             properties:
 *               apiKey:
 *                 type: string
 *                 description: Calendly API key
 *               userUri:
 *                 type: string
 *                 description: Calendly user URI
 *               status:
 *                 type: string
 *                 enum: [active, canceled, all]
 *                 default: active
 *               count:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 100
 *                 default: 20
 *               sort:
 *                 type: string
 *                 enum: [start_time:asc, start_time:desc]
 *                 default: start_time:asc
 *     responses:
 *       200:
 *         description: List of Calendly events
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */
router.post('/events', calendlyHandlers.getCalendlyEvents);

/**
 * @openapi
 * /api/calendly/user:
 *   post:
 *     summary: Get current Calendly user
 *     description: Fetches the current user's information from Calendly
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - apiKey
 *             properties:
 *               apiKey:
 *                 type: string
 *                 description: Calendly API key
 *     responses:
 *       200:
 *         description: Current user information
 *       400:
 *         description: API key is required
 *       500:
 *         description: Server error
 */
router.post('/user', calendlyHandlers.getCurrentUser);

/**
 * @openapi
 * /api/calendly/events/invitees:
 *   post:
 *     summary: Get event invitees
 *     description: Fetches invitees for a specific Calendly event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - apiKey
 *               - eventUuid
 *             properties:
 *               apiKey:
 *                 type: string
 *                 description: Calendly API key
 *               eventUuid:
 *                 type: string
 *                 description: UUID of the event to get invitees for
 *     responses:
 *       200:
 *         description: List of event invitees
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/events/invitees', calendlyHandlers.getEventInvitees);

export default router;
