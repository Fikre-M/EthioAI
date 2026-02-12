import { config } from 'dotenv';
import { app } from './app';
import { log } from './utils/logger';

// Load environment variables
config();

// Initialize AI and Map services
let googleAI = null;
let osmClient = null;

// Google AI (Gemini) - ACTIVE
if (process.env.GOOGLE_AI_API_KEY && process.env.GOOGLE_AI_API_KEY !== 'your-google-ai-api-key-here') {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    log.info('✅ Google AI (Gemini) initialized');
  } catch (error) {
    log.warn('⚠️ Google AI initialization failed:', (error as Error).message);
  }
} else {
  log.warn('⚠️ Google AI API key not configured. Please update GOOGLE_AI_API_KEY in .env file');
  log.info('💡 Get your FREE API key from: https://makersuite.google.com/app/apikey');
}

// OpenStreetMap + Leaflet - ACTIVE (No API key required!)
try {
  const axios = require('axios');
  osmClient = {
    nominatimUrl: process.env.OSM_NOMINATIM_URL || 'https://nominatim.openstreetmap.org',
    overpassUrl: process.env.OSM_OVERPASS_URL || 'https://overpass-api.de/api/interpreter',
    tileServer: process.env.OSM_TILE_SERVER || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    
    async geocode(query, options = {}) {
      const params = {
        q: query,
        format: 'json',
        limit: options.limit || 5,
        addressdetails: 1
      };
      
      // Add country code if specified
      if (options.country) {
        params.countrycodes = options.country.toLowerCase();
      }
      
      const response = await axios.get(`${this.nominatimUrl}/search`, { 
        params,
        headers: {
          'User-Agent': 'EthioAI-Tourism-Platform/1.0 (https://ethioai.com)'
        }
      });
      return response.data;
    },
    
    async reverseGeocode(lat, lon) {
      const params = {
        lat,
        lon,
        format: 'json',
        addressdetails: 1
      };
      
      const response = await axios.get(`${this.nominatimUrl}/reverse`, { 
        params,
        headers: {
          'User-Agent': 'EthioAI-Tourism-Platform/1.0 (https://ethioai.com)'
        }
      });
      return response.data;
    },
    
    async getDirections(start, end) {
      // For directions, we'll use a simple routing service or return coordinates
      // This is a basic implementation - for production, consider using OSRM or GraphHopper
      return {
        message: 'Basic routing available. For advanced routing, consider integrating OSRM or GraphHopper.',
        start,
        end,
        provider: 'openstreetmap'
      };
    }
  };
  
  log.info('✅ OpenStreetMap (OSM) client initialized - FREE service!');
} catch (error) {
  log.warn('⚠️ OSM client initialization failed:', error.message);
}

// OpenAI - PREPARED (commented out for later)
// let openaiClient = null;
// if (process.env.OPENAI_API_KEY) {
//   try {
//     const OpenAI = require('openai');
//     openaiClient = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY,
//       organization: process.env.OPENAI_ORGANIZATION_ID || undefined,
//     });
//     log.info('✅ OpenAI initialized');
//   } catch (error) {
//     log.warn('⚠️ OpenAI initialization failed:', error.message);
//   }
// }

// Anthropic - PREPARED (commented out for later)
// let anthropicClient = null;
// if (process.env.ANTHROPIC_API_KEY) {
//   try {
//     const Anthropic = require('@anthropic-ai/sdk');
//     anthropicClient = new Anthropic({
//       apiKey: process.env.ANTHROPIC_API_KEY,
//     });
//     log.info('✅ Anthropic initialized');
//   } catch (error) {
//     log.warn('⚠️ Anthropic initialization failed:', error.message);
//   }
// }

// Export clients for use in routes
export { googleAI, osmClient };
// Export prepared clients (commented out)
// export { openaiClient, anthropicClient };

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// Start server
const server = app.listen(PORT, () => {
  log.info(`🚀 Server running on http://${HOST}:${PORT}`);
  log.info(`📚 API Documentation: http://${HOST}:${PORT}/api/docs`);
  log.info(`🏥 Health Check: http://${HOST}:${PORT}/health`);
  log.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Log active services
  if (googleAI) log.info('🤖 Google AI service: ACTIVE');
  if (osmClient) log.info('🗺️ OpenStreetMap service: ACTIVE (FREE)');
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