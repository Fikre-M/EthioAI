import { Request, Response, NextFunction } from 'express'
import { monitoringService } from '../services/monitoring.service'
import { AuthRequest } from './auth.middleware'
import logger from '../utils/logger'

/**
 * Performance monitoring middleware
 * Records response times and other metrics
 */
export function performanceMonitoring() {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now()
    
    // Add request ID for tracking
    const requestId = generateRequestId()
    req.headers['x-request-id'] = requestId
    res.setHeader('X-Request-ID', requestId)

    // Override res.end to capture response time
    const originalEnd = res.end.bind(res)
    
    res.end = function(chunk?: any, encoding?: any) {
      const responseTime = Date.now() - startTime
      
      // Record metrics
      monitoringService.recordMetrics(req, res, responseTime)
      
      // Add performance headers
      res.setHeader('X-Response-Time', `${responseTime}ms`)
      res.setHeader('X-Timestamp', new Date().toISOString())
      
      // Log request completion
      const authReq = req as AuthRequest
      logger.info('Request completed', {
        requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime,
        userId: authReq.userId,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      })
      
      return originalEnd(chunk, encoding)
    }
    
    next()
  }
}

/**
 * Request timeout middleware
 */
export function requestTimeout(timeoutMs: number = 30000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        logger.warn('Request timeout', {
          method: req.method,
          url: req.originalUrl,
          timeout: timeoutMs,
          ip: req.ip
        })
        
        res.status(408).json({
          success: false,
          message: 'Request timeout',
          code: 'REQUEST_TIMEOUT'
        })
      }
    }, timeoutMs)
    
    // Clear timeout when response is sent
    const originalEnd = res.end.bind(res)
    res.end = function(chunk?: any, encoding?: any) {
      clearTimeout(timeout)
      return originalEnd(chunk, encoding)
    }
    
    next()
  }
}

/**
 * Rate limiting with monitoring
 */
export function enhancedRateLimit(options: {
  windowMs: number
  maxRequests: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}) {
  const requests = new Map<string, { count: number; resetTime: number }>()
  
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip
    const now = Date.now()
    const windowStart = now - options.windowMs
    
    // Clean up old entries
    for (const [ip, data] of requests.entries()) {
      if (data.resetTime < now) {
        requests.delete(ip)
      }
    }
    
    // Get or create request data
    let requestData = requests.get(key)
    if (!requestData || requestData.resetTime < now) {
      requestData = {
        count: 0,
        resetTime: now + options.windowMs
      }
      requests.set(key, requestData)
    }
    
    // Check if limit exceeded
    if (requestData.count >= options.maxRequests) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
        count: requestData.count,
        limit: options.maxRequests
      })
      
      return res.status(429).json({
        success: false,
        message: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((requestData.resetTime - now) / 1000)
      })
    }
    
    // Increment counter
    requestData.count++
    
    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', options.maxRequests)
    res.setHeader('X-RateLimit-Remaining', Math.max(0, options.maxRequests - requestData.count))
    res.setHeader('X-RateLimit-Reset', Math.ceil(requestData.resetTime / 1000))
    
    next()
  }
}

/**
 * Memory usage monitoring
 */
export function memoryMonitoring() {
  return (req: Request, res: Response, next: NextFunction) => {
    const memUsage = process.memoryUsage()
    const memoryUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024)
    
    // Warn if memory usage is high
    if (memoryUsageMB > 500) { // 500MB threshold
      logger.warn('High memory usage detected', {
        heapUsed: memoryUsageMB + 'MB',
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
        external: Math.round(memUsage.external / 1024 / 1024) + 'MB',
        url: req.originalUrl
      })
    }
    
    // Add memory usage header in development
    if (process.env.NODE_ENV === 'development') {
      res.setHeader('X-Memory-Usage', memoryUsageMB + 'MB')
    }
    
    next()
  }
}

/**
 * Security monitoring middleware
 */
export function securityMonitoring() {
  return (req: Request, res: Response, next: NextFunction) => {
    const suspiciousPatterns = [
      /\.\.\//,  // Path traversal
      /<script/i, // XSS attempts
      /union.*select/i, // SQL injection
      /javascript:/i, // JavaScript injection
      /eval\(/i, // Code injection
    ]
    
    const requestString = JSON.stringify({
      url: req.originalUrl,
      query: req.query,
      body: req.body,
      headers: req.headers
    })
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(requestString)) {
        logger.security('Suspicious request detected', {
          ip: req.ip,
          method: req.method,
          url: req.originalUrl,
          userAgent: req.get('User-Agent'),
          pattern: pattern.toString(),
          timestamp: new Date().toISOString()
        })
        
        // You might want to block the request or take other actions
        break
      }
    }
    
    next()
  }
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}