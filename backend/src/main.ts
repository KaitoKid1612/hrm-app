import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // Enable CORS - Allow both client and admin frontends
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'https://vungang-jobs-client.onrender.com',
    process.env.ADMIN_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://localhost:3001',
  ].filter(Boolean); // Remove undefined values

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list
      if (allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
        callback(null, true);
      } else {
        console.warn(`⚠️  CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Serve static files (for local uploads)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`✅ Server running on port ${port}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(
    `📁 Upload mode: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Cloudinary' : 'Local Storage'}`,
  );
}

bootstrap();
