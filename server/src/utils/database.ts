import { PrismaClient } from '@prisma/client';
import { log } from './logger';

// Create a single instance of PrismaClient
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Handle graceful shutdown
const gracefulShutdown = async () => {
  log.info('Disconnecting from database...');
  await prisma.$disconnect();
  log.info('Database connection closed');
};

// Handle process termination
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('beforeExit', gracefulShutdown);

export default prisma;