/**
 * Cache TTL constants (in seconds)
 */
export const CacheTTL = {
  VERY_SHORT: 60,      // 1 minute
  SHORT: 300,          // 5 minutes
  MEDIUM: 1800,        // 30 minutes
  LONG: 3600,          // 1 hour
  VERY_LONG: 86400,    // 24 hours
} as const;

/**
 * Simple cache service for development
 * In production, this would use Redis
 */
class CacheService {
  private cache = new Map<string, { data: any; expires: number }>();

  async get(key: string): Promise<any | null> {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }
    
    if (cached.expires < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  async set(key: string, value: any, ttl: number = CacheTTL.MEDIUM): Promise<void> {
    this.cache.set(key, {
      data: value,
      expires: Date.now() + (ttl * 1000)
    });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async keys(pattern?: string): Promise<string[]> {
    const keys = Array.from(this.cache.keys());
    
    if (!pattern) {
      return keys;
    }
    
    // Simple pattern matching
    const regex = new RegExp(pattern.replace('*', '.*'));
    return keys.filter(key => regex.test(key));
  }
}

export const cacheService = new CacheService();