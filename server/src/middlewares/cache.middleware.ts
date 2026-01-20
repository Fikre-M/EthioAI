import { Request, Response, NextFunction } from 'express';
import { log } from '../utils/logger';

// Simple in-memory cache for development
const cache = new Map<string, { data: any; expires: number }>();

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  keyGenerator?: (req: Request) => string;
}

/**
 * Cache middleware
 */
export const cacheMiddleware = (options: CacheOptions = {}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ttl = options.ttl || 300; // Default 5 minutes
    const keyGenerator = options.keyGenerator || ((req) => `${req.method}:${req.originalUrl}`);
    
    const cacheKey = keyGenerator(req);
    const cached = cache.get(cacheKey);
    
    if (cached && cached.expires > Date.now()) {
      log.info('Cache hit', { key: cacheKey });
      res.json(cached.data);
      return;
    }
    
    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data: any) {
      // Cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(cacheKey, {
          data,
          expires: Date.now() + (ttl * 1000)
        });
        log.info('Response cached', { key: cacheKey, ttl });
      }
      
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/**
 * Public cache (for unauthenticated requests)
 */
export const publicCache = (ttl: number) => cacheMiddleware({ ttl });

/**
 * User-specific cache
 */
export const userCache = (ttl: number) => cacheMiddleware({
  ttl,
  keyGenerator: (req) => {
    const authReq = req as any;
    const userId = authReq.userId || 'anonymous';
    return `${req.method}:${req.originalUrl}:${userId}`;
  }
});

/**
 * Generic cache export for compatibility
 */
export const cache = cacheMiddleware;

/**
 * Cache invalidation middleware
 */
export const invalidateCache = (patterns: string[] | ((req: Request) => string[])) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Store patterns for post-request invalidation
    (req as any).cacheInvalidationPatterns = typeof patterns === 'function' ? patterns(req) : patterns;
    
    // Override res.json to invalidate cache after successful response
    const originalJson = res.json;
    res.json = function(data: any) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const patternsToInvalidate = (req as any).cacheInvalidationPatterns || [];
        
        for (const pattern of patternsToInvalidate) {
          // Simple pattern matching - in production, use Redis with pattern matching
          for (const [key] of cache) {
            if (key.includes(pattern.replace('*', ''))) {
              cache.delete(key);
              log.info('Cache invalidated', { key, pattern });
            }
          }
        }
      }
      
      return originalJson.call(this, data);
    };
    
    next();
  };
};