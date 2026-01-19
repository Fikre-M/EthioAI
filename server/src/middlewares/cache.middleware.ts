import { Request, Response, NextFunction } from 'express'
import { cacheService, CacheOptions, CacheTTL } from '../services/cache.service'
import { AuthRequest } from './auth.middleware'
import logger from '../utils/logger'
import crypto from 'crypto'

export interface CacheMiddlewareOptions extends CacheOptions {
  keyGenerator?: (req: Request) => string
  condition?: (req: Request, res: Response) => boolean
  varyBy?: string[] // Headers to vary cache by
  skipCache?: (req: Request) => boolean
  onHit?: (key: string) => void
  onMiss?: (key: string) => void
}

/**
 * Cache middleware factory
 */
export function cache(options: CacheMiddlewareOptions = {}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Skip cache if condition is not met
      if (options.skipCache && options.skipCache(req)) {
        return next()
      }

      // Skip cache for non-GET requests by default
      if (req.method !== 'GET') {
        return next()
      }

      // Generate cache key
      const cacheKey = options.keyGenerator 
        ? options.keyGenerator(req)
        : generateDefaultCacheKey(req, options.varyBy)

      // Try to get from cache
      const cachedResponse = await cacheService.get<{
        statusCode: number
        headers: Record<string, string>
        body: any
      }>(cacheKey, {
        prefix: 'response',
        ttl: options.ttl || CacheTTL.MEDIUM
      })

      if (cachedResponse) {
        // Cache hit
        if (options.onHit) {
          options.onHit(cacheKey)
        }

        // Set cached headers
        if (cachedResponse.headers) {
          Object.entries(cachedResponse.headers).forEach(([key, value]) => {
            res.setHeader(key, value)
          })
        }

        // Add cache headers
        res.setHeader('X-Cache', 'HIT')
        res.setHeader('X-Cache-Key', cacheKey)

        return res.status(cachedResponse.statusCode).json(cachedResponse.body)
      }

      // Cache miss - continue to route handler
      if (options.onMiss) {
        options.onMiss(cacheKey)
      }

      // Override res.json to cache the response
      const originalJson = res.json.bind(res)
      const originalStatus = res.status.bind(res)
      let statusCode = 200

      // Track status code
      res.status = function(code: number) {
        statusCode = code
        return originalStatus(code)
      }

      res.json = function(body: any) {
        // Only cache successful responses
        if (statusCode >= 200 && statusCode < 300) {
          // Check condition if provided
          if (!options.condition || options.condition(req, res)) {
            // Cache the response
            const responseToCache = {
              statusCode,
              headers: extractCacheableHeaders(res),
              body
            }

            cacheService.set(cacheKey, responseToCache, {
              prefix: 'response',
              ttl: options.ttl || CacheTTL.MEDIUM
            }).catch(error => {
              logger.error('Failed to cache response:', error)
            })
          }
        }

        // Add cache headers
        res.setHeader('X-Cache', 'MISS')
        res.setHeader('X-Cache-Key', cacheKey)

        return originalJson(body)
      }

      next()
    } catch (error) {
      logger.error('Cache middleware error:', error)
      next()
    }
  }
}

/**
 * Cache invalidation middleware
 */
export function invalidateCache(patterns: string[] | ((req: Request) => string[])) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Store patterns for later use
      res.locals.cacheInvalidationPatterns = typeof patterns === 'function' 
        ? patterns(req) 
        : patterns

      // Override res.json to invalidate cache after successful response
      const originalJson = res.json.bind(res)
      
      res.json = function(body: any) {
        // Only invalidate on successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const patternsToInvalidate = res.locals.cacheInvalidationPatterns as string[]
          
          if (patternsToInvalidate && patternsToInvalidate.length > 0) {
            // Invalidate cache patterns asynchronously
            Promise.all(
              patternsToInvalidate.map(pattern => 
                cacheService.invalidatePattern(pattern, { prefix: 'response' })
              )
            ).then(results => {
              const totalInvalidated = results.reduce((sum, count) => sum + count, 0)
              if (totalInvalidated > 0) {
                logger.info(`Invalidated ${totalInvalidated} cache entries`, {
                  patterns: patternsToInvalidate,
                  method: req.method,
                  path: req.path
                })
              }
            }).catch(error => {
              logger.error('Cache invalidation error:', error)
            })
          }
        }

        return originalJson(body)
      }

      next()
    } catch (error) {
      logger.error('Cache invalidation middleware error:', error)
      next()
    }
  }
}

/**
 * User-specific cache middleware
 */
export function userCache(options: CacheMiddlewareOptions = {}) {
  return cache({
    ...options,
    keyGenerator: (req: Request) => {
      const authReq = req as AuthRequest
      const userId = authReq.userId || 'anonymous'
      const baseKey = options.keyGenerator 
        ? options.keyGenerator(req)
        : generateDefaultCacheKey(req, options.varyBy)
      return `user:${userId}:${baseKey}`
    }
  })
}

/**
 * Public cache middleware (for public endpoints)
 */
export function publicCache(ttl: number = CacheTTL.LONG) {
  return cache({
    ttl,
    condition: (req: Request, res: Response) => {
      // Only cache if no user-specific data
      const authReq = req as AuthRequest
      return !authReq.userId
    }
  })
}

/**
 * Generate default cache key from request
 */
function generateDefaultCacheKey(req: Request, varyBy?: string[]): string {
  const parts = [
    req.method,
    req.path,
    JSON.stringify(req.query)
  ]

  // Add headers to vary by
  if (varyBy && varyBy.length > 0) {
    const headerValues = varyBy.map(header => 
      req.headers[header.toLowerCase()] || ''
    ).join('|')
    parts.push(headerValues)
  }

  const keyString = parts.join('|')
  return crypto.createHash('md5').update(keyString).digest('hex')
}

/**
 * Extract cacheable headers from response
 */
function extractCacheableHeaders(res: Response): Record<string, string> {
  const cacheableHeaders: Record<string, string> = {}
  
  // Headers that are safe to cache
  const safeHeaders = [
    'content-type',
    'content-language',
    'content-encoding',
    'etag',
    'last-modified',
    'vary'
  ]

  safeHeaders.forEach(header => {
    const value = res.getHeader(header)
    if (value && typeof value === 'string') {
      cacheableHeaders[header] = value
    }
  })

  return cacheableHeaders
}

/**
 * Cache warming utility
 */
export class CacheWarmer {
  static async warmUserCache(userId: string, endpoints: string[]) {
    logger.info(`Warming cache for user ${userId}`)
    
    for (const endpoint of endpoints) {
      try {
        // This would typically make internal requests to warm the cache
        // Implementation depends on your specific needs
        logger.debug(`Warming cache for endpoint: ${endpoint}`)
      } catch (error) {
        logger.error(`Failed to warm cache for ${endpoint}:`, error)
      }
    }
  }

  static async warmPublicCache(endpoints: string[]) {
    logger.info('Warming public cache')
    
    for (const endpoint of endpoints) {
      try {
        // This would typically make internal requests to warm the cache
        logger.debug(`Warming public cache for endpoint: ${endpoint}`)
      } catch (error) {
        logger.error(`Failed to warm public cache for ${endpoint}:`, error)
      }
    }
  }
}

/**
 * Cache statistics middleware
 */
export function cacheStats() {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/cache/stats' && req.method === 'GET') {
      try {
        const stats = await cacheService.getStats()
        return res.json({
          success: true,
          data: stats
        })
      } catch (error) {
        logger.error('Cache stats error:', error)
        return res.status(500).json({
          success: false,
          message: 'Failed to get cache statistics'
        })
      }
    }
    next()
  }
}

/**
 * Cache management middleware
 */
export function cacheManagement() {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/cache/') && req.method === 'DELETE') {
      try {
        const authReq = req as AuthRequest
        
        // Only allow admins to manage cache
        if (authReq.userRole !== 'ADMIN') {
          return res.status(403).json({
            success: false,
            message: 'Admin access required'
          })
        }

        const action = req.path.split('/')[2]
        
        switch (action) {
          case 'clear':
            const pattern = req.query.pattern as string
            const cleared = await cacheService.clear(pattern)
            return res.json({
              success: true,
              message: `Cleared ${cleared} cache entries`,
              pattern
            })
            
          case 'invalidate':
            const invalidatePattern = req.query.pattern as string
            if (!invalidatePattern) {
              return res.status(400).json({
                success: false,
                message: 'Pattern parameter required'
              })
            }
            
            const invalidated = await cacheService.invalidatePattern(invalidatePattern)
            return res.json({
              success: true,
              message: `Invalidated ${invalidated} cache entries`,
              pattern: invalidatePattern
            })
            
          default:
            return res.status(404).json({
              success: false,
              message: 'Cache action not found'
            })
        }
      } catch (error) {
        logger.error('Cache management error:', error)
        return res.status(500).json({
          success: false,
          message: 'Cache management failed'
        })
      }
    }
    next()
  }
}