import winston from 'winston';
import { config } from '../config';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define which transports the logger must use
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
];

// Add file transport for production
if (config.nodeEnv === 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }) as any,
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }) as any
  );
}

// Create the logger
const logger = winston.createLogger({
  level: config.logging.level,
  levels,
  format,
  transports,
  exitOnError: false,
});

// Create a stream object for Morgan HTTP logging
export const loggerStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Enhanced logging methods with context
export const log = {
  error: (message: string, meta?: any) => {
    logger.error(message, meta);
  },
  
  warn: (message: string, meta?: any) => {
    logger.warn(message, meta);
  },
  
  info: (message: string, meta?: any) => {
    logger.info(message, meta);
  },
  
  http: (message: string, meta?: any) => {
    logger.http(message, meta);
  },
  
  debug: (message: string, meta?: any) => {
    logger.debug(message, meta);
  },

  // Specific logging methods for common scenarios
  auth: (action: string, userId?: string, meta?: any) => {
    logger.info(`AUTH: ${action}`, { userId, ...meta });
  },

  api: (method: string, path: string, statusCode: number, responseTime?: number, userId?: string) => {
    logger.http(`${method} ${path} ${statusCode}`, {
      method,
      path,
      statusCode,
      responseTime,
      userId,
    });
  },

  database: (operation: string, table: string, duration?: number, meta?: any) => {
    logger.debug(`DB: ${operation} on ${table}`, { operation, table, duration, ...meta });
  },

  payment: (action: string, amount?: number, currency?: string, paymentId?: string, meta?: any) => {
    logger.info(`PAYMENT: ${action}`, { amount, currency, paymentId, ...meta });
  },

  security: (event: string, ip?: string, userAgent?: string, meta?: any) => {
    logger.warn(`SECURITY: ${event}`, { ip, userAgent, ...meta });
  },

  performance: (operation: string, duration: number, meta?: any) => {
    if (duration > 1000) { // Log slow operations (>1s)
      logger.warn(`SLOW: ${operation} took ${duration}ms`, { operation, duration, ...meta });
    } else {
      logger.debug(`PERF: ${operation} took ${duration}ms`, { operation, duration, ...meta });
    }
  },
};

export default logger;