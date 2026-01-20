import { config as dotenvConfig } from 'dotenv';

// Load environment variables first
dotenvConfig();

export const config = {
  // Server configuration
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    host: process.env.HOST || 'localhost',
    nodeEnv: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || '/api',
  },

  // Database configuration
  database: {
    url: process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/ethioai_tourism',
  },

  // Redis configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB || '0', 10),
    url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    accessSecret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'your-access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'your-refresh-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Client configuration
  client: {
    url: process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:3002',
  },

  // Email configuration
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@ethioai.com',
  },

  // File upload configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },

  // Cloudinary configuration
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },

  // Payment configuration
  payment: {
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    },
    chapa: {
      secretKey: process.env.CHAPA_SECRET_KEY || '',
      publicKey: process.env.CHAPA_PUBLIC_KEY || '',
      webhookSecret: process.env.CHAPA_WEBHOOK_SECRET || '',
    },
  },

  // Firebase configuration
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  },

  // Security configuration
  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  // OpenAI configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000', 10),
  },

  // Admin configuration
  admin: {
    emails: process.env.ADMIN_EMAILS?.split(',') || ['admin@ethioai.com'],
  },

  // Feature flags
  features: {
    emailVerificationRequired: process.env.EMAIL_VERIFICATION_REQUIRED === 'true',
    maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
    registrationEnabled: process.env.REGISTRATION_ENABLED !== 'false',
  },
};

// Validate required configuration
const requiredEnvVars = [
  'JWT_SECRET',
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Warn about missing optional but important configuration
const importantEnvVars = [
  'EMAIL_HOST',
  'EMAIL_USER',
  'EMAIL_PASS',
  'CLOUDINARY_CLOUD_NAME',
  'STRIPE_SECRET_KEY',
];

const missingImportantVars = importantEnvVars.filter(envVar => !process.env[envVar]);

if (missingImportantVars.length > 0 && config.server.nodeEnv === 'production') {
  console.warn('Missing important environment variables for production:', missingImportantVars);
}

export default config;