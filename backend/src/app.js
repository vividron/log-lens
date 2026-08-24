import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import logRoutes from './routes/log.routes.js';
import anomalyRoutes from './routes/anomaly.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',').map((origin) => origin.trim()).filter(Boolean);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins }));
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ success: true, message: 'LogLens API is running' }));
app.use('/api/logs', logRoutes);
app.use('/api/anomalies', anomalyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
