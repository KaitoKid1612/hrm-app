import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import config from './config/index.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: config.frontendUrl,
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
