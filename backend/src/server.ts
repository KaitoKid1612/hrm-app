import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import config from '@/config/index.js';
import routes from '@/routes/index.js';

dotenv.config();

const app = express();

// CORS configuration - cho phép nhiều origins
const allowedOrigins = [
  'http://localhost:3000', // Admin frontend
  'http://localhost:5173', // Client frontend (Vite)
  process.env.FRONTEND_URL, // Additional frontend URL from env
].filter(Boolean);

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (như mobile apps, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_, res) => res.json({ status: 'OK', message: 'Backend running 🚀' }));

// API Routes
app.use('/api', routes);

// Error handling
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
});

export default app;
