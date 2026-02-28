import { config } from 'dotenv';
import { app } from './app';
import { log } from './utils/logger';

// Load environment variables
config();

// This file is deprecated - use server.ts instead
// Keeping for backward compatibility only

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  log.warn('⚠️ Using deprecated index.ts - please use server.ts instead');
  log.info(`Server running on port ${PORT}`);
});

