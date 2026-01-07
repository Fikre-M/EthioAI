import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/not-found.middleware';
import { logger } from './utils/logger';
// In your main server file (e.g., app.ts or index.ts)
import paymentRoutes from './routes/payment.routes';



// Load environment variables
config();

// Create Express application
export const app: Application = express();

// Middleware
app.use("/api/payments", paymentRoutes);
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API routes will be mounted here
// app.use(`${process.env.API_PREFIX}`, routes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be the last middleware)
app.use(errorHandler);

export default app;









// // server/src/app.module.ts
// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { BookingModule } from './modules/booking/booking.module';
// import { PrismaModule } from './prisma/prisma.module';
// import { AuthModule } from './modules/auth/auth.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     PrismaModule,
//     AuthModule,
//     BookingModule,
//   ],
// })
// export class AppModule {}