import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { getCalendlyEvents } from './handlers/calendly.handlers.js';

// Get port from environment variable or use default
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Create Express app
const app = express();
const httpServer = createServer(app);

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.post('/api/calendly/events', getCalendlyEvents);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  return res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Handle process termination
const shutdown = () => {
  console.log('Shutting down server...');
  httpServer.close(() => {
    console.log('Server stopped successfully');    
    process.exit(0);
  });
};

// Handle process termination signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  shutdown();
});

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Calendly API Server running on http://localhost:${PORT}`);
  console.log(`Calendly Events endpoint: POST http://localhost:${PORT}/api/calendly/events`);
});