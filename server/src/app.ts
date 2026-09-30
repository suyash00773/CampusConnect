import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: [
        ENV.CLIENT_URL,
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      app: 'CampusConnect API',
      timestamp: new Date().toISOString(),
      environment: ENV.NODE_ENV,
    });
  });

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/clubs', clubRoutes);
  app.use('/api/registrations', registrationRoutes);
  app.use('/api/stats', statsRoutes);

  // 404 Route Handler
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `API endpoint '${req.originalUrl}' not found.`,
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
