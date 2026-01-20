import { config } from 'dotenv';
import { app } from './app';
import { log } from './utils/logger';

// Load environment variables
config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// Start server
const server = app.listen(PORT, () => {
  log.info(`🚀 Server running on http://${HOST}:${PORT}`);
  log.info(`📚 API Documentation: http://${HOST}:${PORT}/api/docs`);
  log.info(`🏥 Health Check: http://${HOST}:${PORT}/health`);
  log.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  log.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    log.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  log.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    log.info('Process terminated');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  log.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  log.error('Uncaught Exception thrown:', error);
  process.exit(1);
});

export default server;