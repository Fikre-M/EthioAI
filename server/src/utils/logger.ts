import winston from 'winston';

// Create Winston logger with fallback configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ethioai-backend' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Enhanced logging methods
export const log = {
  info: (message: string, meta?: any) => {
    logger.info(message, meta);
  },
  
  error: (message: string, error?: any, meta?: any) => {
    logger.error(message, { error: error?.message || error, stack: error?.stack, ...meta });
  },
  
  warn: (message: string, meta?: any) => {
    logger.warn(message, meta);
  },
  
  debug: (message: string, meta?: any) => {
    logger.debug(message, meta);
  },
  
  auth: (message: string, userId?: string, meta?: any) => {
    logger.info(`[AUTH] ${message}`, { userId, ...meta });
  },
  
  security: (message: string, userId?: string, userAgent?: string, meta?: any) => {
    logger.warn(`[SECURITY] ${message}`, { userId, userAgent, ...meta });
  },
  
  admin: (message: string, adminId: string, meta?: any) => {
    logger.info(`[ADMIN] ${message}`, { adminId, ...meta });
  }
};

// Export the winston logger for direct use if needed
export { logger };