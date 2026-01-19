import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { PrismaClient } from "@prisma/client";
import { errorHandler, notFound } from "./middlewares/error.middleware";
import { requestLogger, errorLogger } from "./middlewares/logging.middleware";
import { cacheStats, cacheManagement } from "./middlewares/cache.middleware";
import { performanceMonitoring, requestTimeout, memoryMonitoring, securityMonitoring } from "./middlewares/performance.middleware";
import { monitoringService } from "./services/monitoring.service";
import { responseMiddleware } from "./utils/response";
import { log } from "./utils/logger";
import { config } from "./config";

// Import routes
import authRoutes from "./routes/auth.routes";
import tourRoutes from "./routes/tour.routes";
import bookingRoutes from "./routes/booking.routes";
import paymentRoutes from "./routes/payment.routes";
import marketplaceRoutes from "./routes/marketplace.routes";
import chatRoutes from "./routes/chat.routes";
import culturalRoutes from "./routes/cultural.routes";
import itineraryRoutes from "./routes/itinerary.routes";
import transportRoutes from "./routes/transport.routes";
import uploadRoutes from "./routes/upload.routes";

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: config.nodeEnv === 'development' ? ["query", "info", "warn", "error"] : ["error"],
});

const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware with custom CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "data:", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "https://api.stripe.com", `http://localhost:${config.port}`, config.clientUrl],
        frameSrc: ["'self'", "https://js.stripe.com", "https://hooks.stripe.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false, // Required for Stripe Elements
  })
);

app.use(compression());

// Rate limiting with configurable values
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
    code: "RATE_LIMIT_EXCEEDED"
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    log.security('Rate limit exceeded', req.ip, req.get('User-Agent'), {
      url: req.originalUrl,
      method: req.method,
    });
    res.status(429).json({
      success: false,
      message: "Too many requests from this IP, please try again later.",
      code: "RATE_LIMIT_EXCEEDED"
    });
  },
});
app.use("/api/", limiter);

// CORS configuration using config
app.use(
  cors({
    origin: config.clientUrl.split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Body parsing middleware
app.use(express.json({ 
  limit: "10mb",
  verify: (req, res, buf) => {
    // Store raw body for webhook verification
    (req as any).rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Add response utilities to all responses
app.use(responseMiddleware);

// Performance and security monitoring
app.use(performanceMonitoring());
app.use(requestTimeout(30000)); // 30 second timeout
app.use(memoryMonitoring());
app.use(securityMonitoring());

// Request logging middleware
app.use(requestLogger);

// Cache management middleware (for admin endpoints)
app.use(cacheStats());
app.use(cacheManagement());

// Health check endpoint
app.get("/health", async (req: Request, res: Response) => {
  try {
    const healthCheck = await monitoringService.performHealthCheck()
    
    const statusCode = healthCheck.status === 'healthy' ? 200 : 
                      healthCheck.status === 'degraded' ? 200 : 503
    
    res.status(statusCode).json({
      status: healthCheck.status,
      message: "EthioAI Tourism Server Health Check",
      timestamp: healthCheck.timestamp,
      environment: healthCheck.environment,
      version: healthCheck.version,
      uptime: healthCheck.uptime,
      services: healthCheck.services,
      metrics: healthCheck.metrics
    })
  } catch (error) {
    logger.error('Health check failed:', error)
    res.status(503).json({
      status: 'unhealthy',
      message: 'Health check failed',
      timestamp: new Date().toISOString(),
      error: (error as Error).message
    })
  }
})

// Detailed health check for monitoring systems
app.get("/health/detailed", async (req: Request, res: Response) => {
  try {
    const [healthCheck, performanceStats, errorReports] = await Promise.all([
      monitoringService.performHealthCheck(),
      monitoringService.getPerformanceStats(),
      monitoringService.getErrorReports(10)
    ])
    
    res.json({
      health: healthCheck,
      performance: performanceStats,
      recentErrors: errorReports,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('Detailed health check failed:', error)
    res.status(500).json({
      success: false,
      message: 'Detailed health check failed',
      error: (error as Error).message
    })
  }
})

// Readiness probe (for Kubernetes)
app.get("/ready", async (req: Request, res: Response) => {
  try {
    // Quick readiness check
    await prisma.$queryRaw`SELECT 1`
    res.status(200).json({ status: 'ready' })
  } catch (error) {
    res.status(503).json({ status: 'not ready', error: (error as Error).message })
  }
})

// Liveness probe (for Kubernetes)
app.get("/live", (req: Request, res: Response) => {
  res.status(200).json({ status: 'alive', timestamp: new Date().toISOString() })
})

// API status endpoint with monitoring data
app.get("/api/status", async (req: Request, res: Response) => {
  try {
    const performanceStats = monitoringService.getPerformanceStats()
    
    res.status(200).json({
      success: true,
      message: "API is operational",
      data: {
        environment: config.nodeEnv,
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        performance: {
          avgResponseTime: performanceStats.avgResponseTime,
          requestsPerSecond: performanceStats.requestsPerSecond,
          errorRate: performanceStats.errorRate,
          totalRequests: performanceStats.totalRequests,
          memoryUsage: Math.round(performanceStats.memoryUsage.heapUsed / 1024 / 1024) + 'MB'
        }
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "API status check failed",
      error: (error as Error).message
    })
  }
})

// Performance metrics endpoint (admin only)
app.get("/api/metrics", async (req: Request, res: Response) => {
  try {
    // This would typically require admin authentication
    const performanceStats = monitoringService.getPerformanceStats()
    
    res.json({
      success: true,
      data: performanceStats
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get metrics",
      error: (error as Error).message
    })
  }
})

// Error reports endpoint (admin only)
app.get("/api/errors", async (req: Request, res: Response) => {
  try {
    // This would typically require admin authentication
    const limit = parseInt(req.query.limit as string) || 50
    const errorReports = await monitoringService.getErrorReports(limit)
    
    res.json({
      success: true,
      data: errorReports
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get error reports",
      error: (error as Error).message
    })
  }
})

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/cultural", culturalRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/upload", uploadRoutes);

// Error logging middleware (before error handlers)
app.use(errorLogger);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start server
const server = app.listen(config.port, () => {
  log.info(`🚀 Server running on port ${config.port}`);
  log.info(`🌍 Environment: ${config.nodeEnv}`);
  log.info(`🔗 Client URL: ${config.clientUrl}`);
  log.info(`📄 Health Check: http://localhost:${config.port}/health`);
  log.info(`📊 API Status: http://localhost:${config.port}/api/status`);
});

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  log.info(`📡 Received ${signal}. Starting graceful shutdown...`);
  
  server.close(async () => {
    log.info('🔌 HTTP server closed');
    
    try {
      // Cleanup monitoring service
      await monitoringService.cleanup();
      log.info('📊 Monitoring service cleaned up');
      
      // Close database connection
      await prisma.$disconnect();
      log.info('🗄️ Database connection closed');
      
      log.info('✅ Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      log.error('❌ Error during graceful shutdown:', error);
      process.exit(1);
    }
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    log.error('❌ Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  log.error(`❌ Unhandled Rejection: ${err.message}`, { stack: err.stack });
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  log.error(`❌ Uncaught Exception: ${err.message}`, { stack: err.stack });
  server.close(() => process.exit(1));
});

export default app;