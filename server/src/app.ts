import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/not-found.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import tourRoutes from './routes/tour.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';
import webhookRoutes from './routes/webhook.routes';
import uploadRoutes from './routes/upload.routes';
import chatRoutes from './routes/chat.routes';
import culturalRoutes from './routes/cultural.routes';
import reviewRoutes from './routes/reviews.routes';
import itineraryRoutes from './routes/itinerary.routes';
import transportRoutes from './routes/transport.routes';
import marketplaceRoutes from './routes/marketplace.routes';

// Load environment variables
config();

// Create Express application
export const app: Application = express();

// Initialize services asynchronously (don't block startup)
async function initializeServices() {
  try {
    // Import services dynamically to avoid circular dependencies
    const { EmailService } = await import('./services/email.service');
    
    // Initialize email service (safe to fail)
    try {
      await EmailService.initialize();
      console.log('✅ Email service initialized');
    } catch (emailError) {
      console.warn('⚠️ Email service initialization skipped:', emailError.message);
    }
    
    // Try to initialize database-dependent services
    try {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      
      // Test database connection
      await prisma.$connect();
      console.log('✅ Database connection successful');
      
      // Create required database tables
      const { createPasswordResetTable } = await import('./services/password-reset.service');
      const { createEmailVerificationTable } = await import('./services/email-verification.service');
      
      await createPasswordResetTable();
      await createEmailVerificationTable();
      
      console.log('✅ Database services initialized successfully');
      await prisma.$disconnect();
    } catch (dbError) {
      console.warn('⚠️ Database services initialization failed (server will continue without database features):', dbError.message);
      console.warn('💡 To enable database features:');
      console.warn('   1. Start MySQL server');
      console.warn('   2. Create database: CREATE DATABASE ethioai_tourism;');
      console.warn('   3. Run: npx prisma migrate dev');
    }
    
  } catch (error) {
    console.warn('⚠️ Service initialization failed (continuing anyway):', error.message);
  }
}

// Initialize services in background
initializeServices();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      connectSrc: ["'self'", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3002',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
// Note: Webhook routes need raw body, so they're handled separately
app.use('/api/webhooks', webhookRoutes);

// Regular JSON parsing for other routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
const API_PREFIX = process.env.API_PREFIX || '/api';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);
app.use(`${API_PREFIX}/tours`, tourRoutes);
app.use(`${API_PREFIX}/bookings`, bookingRoutes);
app.use(`${API_PREFIX}/payments`, paymentRoutes);
app.use(`${API_PREFIX}/upload`, uploadRoutes);
app.use(`${API_PREFIX}/chat`, chatRoutes);
app.use(`${API_PREFIX}/cultural`, culturalRoutes);
app.use(`${API_PREFIX}/reviews`, reviewRoutes);
app.use(`${API_PREFIX}/itineraries`, itineraryRoutes);
app.use(`${API_PREFIX}/transport`, transportRoutes);
app.use(`${API_PREFIX}/marketplace`, marketplaceRoutes);

// API documentation endpoint
app.get(`${API_PREFIX}/docs`, (req: Request, res: Response) => {
  res.json({
    message: 'EthioAI Tourism Platform API',
    version: '1.0.0',
    documentation: 'https://docs.ethioai.com',
    endpoints: {
      auth: `${API_PREFIX}/auth`,
      admin: `${API_PREFIX}/admin`,
      tours: `${API_PREFIX}/tours`,
      bookings: `${API_PREFIX}/bookings`,
      payments: `${API_PREFIX}/payments`,
      webhooks: `${API_PREFIX}/webhooks`,
      upload: `${API_PREFIX}/upload`,
      chat: `${API_PREFIX}/chat`,
      cultural: `${API_PREFIX}/cultural`,
      reviews: `${API_PREFIX}/reviews`,
      itineraries: `${API_PREFIX}/itineraries`,
      transport: `${API_PREFIX}/transport`,
      marketplace: `${API_PREFIX}/marketplace`
    }
  });
});

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