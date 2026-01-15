import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { PrismaClient } from "@prisma/client";
import { errorHandler, notFound } from "./middlewares/error.middleware";
import { requestLogger, errorLogger } from "./middlewares/logging.middleware";
import { responseMiddleware } from "./utils/response";
import { log } from "./utils/logger";
import { config } from "./config";

// Import routes
import authRoutes from "./routes/auth.routes";
import tourRoutes from "./routes/tour.routes";

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

// Request logging middleware
app.use(requestLogger);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "EthioAI Tourism Server is running",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: "1.0.0",
    uptime: process.uptime(),
  });
});

// API status endpoint
app.get("/api/status", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is operational",
    data: {
      environment: config.nodeEnv,
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);

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
    
    // Close database connection
    await prisma.$disconnect();
    log.info('🗄️ Database connection closed');
    
    log.info('✅ Graceful shutdown completed');
    process.exit(0);
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