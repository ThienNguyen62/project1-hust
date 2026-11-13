import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/health.routes.js';

dotenv.config({ path: new URL('../.env', import.meta.url), quiet: true });

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const app = express();

app.use(cors({ origin: clientOrigin }));
app.use(express.json());
app.use('/api', healthRoutes);

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Express identifies error middleware by its four arguments.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status >= 400 && err.status < 500 ? err.status : 500;
  if (status === 500) console.error(err);
  res.status(status).json({
    status: 'error',
    message: status === 500 ? 'Internal server error' : 'Invalid request',
  });
});

export default app;
