import { Redis } from 'ioredis'
import { redisClient } from '../config/redis.config'
import logger from '../utils/logger'

export interface CacheOptions {
  ttl?: number // Time to live in seconds
  prefix?: string
  compress?: boolean
}

export class CacheService {
  private redis: Redis
  private defaultTTL: number = 3600 // 1 hour default

  constructor() {
    this.redis = redisClient
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    try {
      // Check if Redis is available in development
      if (!process.env.REDIS_HOST && process.env.NODE_ENV === 'development') {
        return null // Return null to indicate cache miss
      }
      
      const fullKey = this.buildKey(key, options.prefix)
      const cached = await this.redis.get(fullKey)
      
      if (!cached) {
        return null
      }

      const parsed = JSON.parse(cached)
      
      // Check if data has metadata (for compressed or timestamped data)
      if (parsed && typeof parsed === 'object' && parsed._cached) {
        return parsed.data as T
      }
      
      return parsed as T
    } catch (error) {
      logger.error('Cache get error:', error)
      return null
    }
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<boolean> {
    try {
      // Check if Redis is available in development
      if (!process.env.REDIS_HOST && process.env.NODE_ENV === 'development') {
        return true // Return true to indicate success (no-op)
      }
      
      const fullKey = this.buildKey(key, options.prefix)
      const ttl = options.ttl || this.defaultTTL
      
      // Wrap data with metadata
      const cacheData = {
        _cached: true,
        _timestamp: Date.now(),
        data: value
      }
      
      const serialized = JSON.stringify(cacheData)
      
      if (ttl > 0) {
        await this.redis.setex(fullKey, ttl, serialized)
      } else {
        await this.redis.set(fullKey, serialized)
      }
      
      return true
    } catch (error) {
      logger.error('Cache set error:', error)
      return false
    }
  }

  /**
   * Delete from cache
   */
  async del(key: string, options: CacheOptions = {}): Promise<boolean> {
    try {
      const fullKey = this.buildKey(key, options.prefix)
      const result = await this.redis.del(fullKey)
      return result > 0
    } catch (error) {
      logger.error('Cache delete error:', error)
      return false
    }
  }

  /**
   * Check if key exists in cache
   */
  async exists(key: string, options: CacheOptions = {}): Promise<boolean> {
    try {
      const fullKey = this.buildKey(key, options.prefix)
      const result = await this.redis.exists(fullKey)
      return result === 1
    } catch (error) {
      logger.error('Cache exists error:', error)
      return false
    }
  }

  /**
   * Get or set pattern - fetch from cache or execute function and cache result
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key, options)
      if (cached !== null) {
        return cached
      }

      // Execute function to get fresh data
      const freshData = await fetchFn()
      
      // Cache the result
      await this.set(key, freshData, options)
      
      return freshData
    } catch (error) {
      logger.error('Cache getOrSet error:', error)
      // If caching fails, still return the fresh data
      return await fetchFn()
    }
  }

  /**
   * Invalidate cache by pattern
   */
  async invalidatePattern(pattern: string, options: CacheOptions = {}): Promise<number> {
    try {
      const fullPattern = this.buildKey(pattern, options.prefix)
      const keys = await this.redis.keys(fullPattern)
      
      if (keys.length === 0) {
        return 0
      }
      
      const result = await this.redis.del(...keys)
      logger.info(`Invalidated ${result} cache keys matching pattern: ${fullPattern}`)
      return result
    } catch (error) {
      logger.error('Cache invalidate pattern error:', error)
      return 0
    }
  }

  /**
   * Set multiple values at once
   */
  async mset(data: Record<string, any>, options: CacheOptions = {}): Promise<boolean> {
    try {
      const pipeline = this.redis.pipeline()
      const ttl = options.ttl || this.defaultTTL
      
      for (const [key, value] of Object.entries(data)) {
        const fullKey = this.buildKey(key, options.prefix)
        const cacheData = {
          _cached: true,
          _timestamp: Date.now(),
          data: value
        }
        const serialized = JSON.stringify(cacheData)
        
        if (ttl > 0) {
          pipeline.setex(fullKey, ttl, serialized)
        } else {
          pipeline.set(fullKey, serialized)
        }
      }
      
      await pipeline.exec()
      return true
    } catch (error) {
      logger.error('Cache mset error:', error)
      return false
    }
  }

  /**
   * Get multiple values at once
   */
  async mget<T>(keys: string[], options: CacheOptions = {}): Promise<(T | null)[]> {
    try {
      const fullKeys = keys.map(key => this.buildKey(key, options.prefix))
      const results = await this.redis.mget(...fullKeys)
      
      return results.map(result => {
        if (!result) return null
        
        try {
          const parsed = JSON.parse(result)
          if (parsed && typeof parsed === 'object' && parsed._cached) {
            return parsed.data as T
          }
          return parsed as T
        } catch {
          return null
        }
      })
    } catch (error) {
      logger.error('Cache mget error:', error)
      return keys.map(() => null)
    }
  }

  /**
   * Increment a numeric value in cache
   */
  async incr(key: string, options: CacheOptions = {}): Promise<number> {
    try {
      const fullKey = this.buildKey(key, options.prefix)
      return await this.redis.incr(fullKey)
    } catch (error) {
      logger.error('Cache incr error:', error)
      return 0
    }
  }

  /**
   * Set expiration for existing key
   */
  async expire(key: string, ttl: number, options: CacheOptions = {}): Promise<boolean> {
    try {
      const fullKey = this.buildKey(key, options.prefix)
      const result = await this.redis.expire(fullKey, ttl)
      return result === 1
    } catch (error) {
      logger.error('Cache expire error:', error)
      return false
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    memory: string
    keys: number
    hits: string
    misses: string
    hitRate: string
  }> {
    try {
      const info = await this.redis.info('memory')
      const keyspace = await this.redis.info('keyspace')
      const stats = await this.redis.info('stats')
      
      // Parse memory info
      const memoryMatch = info.match(/used_memory_human:(.+)/)
      const memory = memoryMatch ? memoryMatch[1].trim() : 'N/A'
      
      // Parse keyspace info to get total keys
      const keysMatch = keyspace.match(/keys=(\d+)/)
      const keys = keysMatch ? parseInt(keysMatch[1]) : 0
      
      // Parse stats info
      const hitsMatch = stats.match(/keyspace_hits:(\d+)/)
      const missesMatch = stats.match(/keyspace_misses:(\d+)/)
      const hits = hitsMatch ? hitsMatch[1] : '0'
      const misses = missesMatch ? missesMatch[1] : '0'
      
      // Calculate hit rate
      const totalRequests = parseInt(hits) + parseInt(misses)
      const hitRate = totalRequests > 0 
        ? ((parseInt(hits) / totalRequests) * 100).toFixed(2) + '%'
        : '0%'
      
      return {
        memory,
        keys,
        hits,
        misses,
        hitRate
      }
    } catch (error) {
      logger.error('Cache stats error:', error)
      return {
        memory: 'N/A',
        keys: 0,
        hits: '0',
        misses: '0',
        hitRate: '0%'
      }
    }
  }

  /**
   * Clear all cache (use with caution)
   */
  async clear(pattern?: string): Promise<number> {
    try {
      if (pattern) {
        return await this.invalidatePattern(pattern)
      }
      
      await this.redis.flushdb()
      logger.warn('All cache cleared')
      return 1
    } catch (error) {
      logger.error('Cache clear error:', error)
      return 0
    }
  }

  /**
   * Build full cache key with prefix
   */
  private buildKey(key: string, prefix?: string): string {
    const basePrefix = 'ethioai'
    const fullPrefix = prefix ? `${basePrefix}:${prefix}` : basePrefix
    return `${fullPrefix}:${key}`
  }
}

// Export singleton instance
export const cacheService = new CacheService()

// Cache key builders for different entities
export const CacheKeys = {
  // User related
  user: (id: string) => `user:${id}`,
  userProfile: (id: string) => `user:profile:${id}`,
  userPreferences: (id: string) => `user:preferences:${id}`,
  
  // Tour related
  tour: (id: string) => `tour:${id}`,
  tours: (filters: string) => `tours:${filters}`,
  tourReviews: (id: string) => `tour:reviews:${id}`,
  featuredTours: () => 'tours:featured',
  
  // Product related
  product: (id: string) => `product:${id}`,
  products: (filters: string) => `products:${filters}`,
  productReviews: (id: string) => `product:reviews:${id}`,
  
  // Booking related
  booking: (id: string) => `booking:${id}`,
  userBookings: (userId: string) => `user:bookings:${userId}`,
  
  // Cultural content
  culturalContent: (id: string) => `cultural:${id}`,
  culturalList: (filters: string) => `cultural:list:${filters}`,
  
  // Search results
  searchResults: (query: string, type: string) => `search:${type}:${query}`,
  
  // Statistics
  stats: (type: string, period: string) => `stats:${type}:${period}`,
  
  // API responses
  apiResponse: (endpoint: string, params: string) => `api:${endpoint}:${params}`,
}

// Cache TTL constants (in seconds)
export const CacheTTL = {
  SHORT: 300,      // 5 minutes
  MEDIUM: 1800,    // 30 minutes
  LONG: 3600,      // 1 hour
  VERY_LONG: 86400, // 24 hours
  WEEK: 604800,    // 7 days
}