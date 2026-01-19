import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { cacheService } from './cache.service'
import logger from '../utils/logger'
import os from 'os'
import process from 'process'

export interface PerformanceMetrics {
  timestamp: Date
  responseTime: number
  memoryUsage: NodeJS.MemoryUsage
  cpuUsage: NodeJS.CpuUsage
  activeConnections: number
  requestCount: number
  errorCount: number
}

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: Date
  uptime: number
  version: string
  environment: string
  services: {
    database: ServiceHealth
    cache: ServiceHealth
    memory: ServiceHealth
    disk: ServiceHealth
  }
  metrics: {
    responseTime: number
    throughput: number
    errorRate: number
    memoryUsage: number
    cpuUsage: number
  }
}

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  responseTime?: number
  message?: string
  lastCheck: Date
}

export interface ErrorReport {
  id: string
  timestamp: Date
  level: 'error' | 'warn' | 'fatal'
  message: string
  stack?: string
  context: {
    userId?: string
    requestId?: string
    userAgent?: string
    ip?: string
    method?: string
    url?: string
    statusCode?: number
  }
  metadata?: Record<string, any>
}

export class MonitoringService {
  private prisma: PrismaClient
  private metrics: PerformanceMetrics[] = []
  private maxMetricsHistory = 1000
  private startTime = Date.now()
  private requestCount = 0
  private errorCount = 0
  private responseTimeSum = 0

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.startPerformanceMonitoring()
  }

  /**
   * Record performance metrics
   */
  recordMetrics(req: Request, res: Response, responseTime: number) {
    this.requestCount++
    this.responseTimeSum += responseTime

    if (res.statusCode >= 400) {
      this.errorCount++
    }

    const metrics: PerformanceMetrics = {
      timestamp: new Date(),
      responseTime,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      activeConnections: this.getActiveConnections(),
      requestCount: this.requestCount,
      errorCount: this.errorCount
    }

    this.metrics.push(metrics)

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics = this.metrics.slice(-this.maxMetricsHistory)
    }

    // Log slow requests
    if (responseTime > 1000) {
      logger.warn('Slow request detected', {
        url: req.originalUrl,
        method: req.method,
        responseTime,
        statusCode: res.statusCode
      })
    }
  }

  /**
   * Record error for monitoring
   */
  recordError(error: Error, context: ErrorReport['context'] = {}): string {
    const errorId = this.generateErrorId()
    
    const errorReport: ErrorReport = {
      id: errorId,
      timestamp: new Date(),
      level: this.determineErrorLevel(error),
      message: error.message,
      stack: error.stack,
      context,
      metadata: {
        name: error.name,
        cause: (error as any).cause
      }
    }

    // Store error in cache for quick access
    cacheService.set(`error:${errorId}`, errorReport, { ttl: 86400 }) // 24 hours

    // Log error
    logger.error('Error recorded for monitoring', {
      errorId,
      message: error.message,
      context
    })

    return errorId
  }

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now()

    const [databaseHealth, cacheHealth, memoryHealth, diskHealth] = await Promise.all([
      this.checkDatabaseHealth(),
      this.checkCacheHealth(),
      this.checkMemoryHealth(),
      this.checkDiskHealth()
    ])

    const healthCheckTime = Date.now() - startTime
    const overallStatus = this.determineOverallHealth([
      databaseHealth,
      cacheHealth,
      memoryHealth,
      diskHealth
    ])

    const metrics = this.calculateCurrentMetrics()

    return {
      status: overallStatus,
      timestamp: new Date(),
      uptime: this.getUptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: databaseHealth,
        cache: cacheHealth,
        memory: memoryHealth,
        disk: diskHealth
      },
      metrics: {
        responseTime: metrics.avgResponseTime,
        throughput: metrics.requestsPerSecond,
        errorRate: metrics.errorRate,
        memoryUsage: metrics.memoryUsagePercent,
        cpuUsage: metrics.cpuUsagePercent
      }
    }
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats() {
    const recentMetrics = this.metrics.slice(-100) // Last 100 requests
    
    if (recentMetrics.length === 0) {
      return {
        avgResponseTime: 0,
        requestsPerSecond: 0,
        errorRate: 0,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    }

    const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length
    const timeSpan = (recentMetrics[recentMetrics.length - 1].timestamp.getTime() - recentMetrics[0].timestamp.getTime()) / 1000
    const requestsPerSecond = timeSpan > 0 ? recentMetrics.length / timeSpan : 0
    const errorRate = this.errorCount / this.requestCount * 100

    return {
      avgResponseTime: Math.round(avgResponseTime),
      requestsPerSecond: Math.round(requestsPerSecond * 100) / 100,
      errorRate: Math.round(errorRate * 100) / 100,
      totalRequests: this.requestCount,
      totalErrors: this.errorCount,
      uptime: this.getUptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      systemInfo: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        cpus: os.cpus().length,
        loadAverage: os.loadavg()
      }
    }
  }

  /**
   * Get error reports
   */
  async getErrorReports(limit: number = 50): Promise<ErrorReport[]> {
    try {
      // Get error IDs from cache
      const errorKeys = await cacheService['redis'].keys('ethioai:error:*')
      const errorIds = errorKeys.map(key => key.split(':').pop()).slice(0, limit)
      
      const errors = await Promise.all(
        errorIds.map(id => cacheService.get<ErrorReport>(`error:${id}`))
      )

      return errors.filter(Boolean) as ErrorReport[]
    } catch (error) {
      logger.error('Failed to get error reports:', error)
      return []
    }
  }

  /**
   * Clear old metrics and errors
   */
  async cleanup() {
    // Clear old metrics
    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    this.metrics = this.metrics.filter(m => m.timestamp.getTime() > oneHourAgo)

    // Clear old errors (older than 7 days)
    try {
      const errorKeys = await cacheService['redis'].keys('ethioai:error:*')
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
      
      for (const key of errorKeys) {
        const errorId = key.split(':').pop()
        const error = await cacheService.get<ErrorReport>(`error:${errorId}`)
        
        if (error && error.timestamp.getTime() < sevenDaysAgo) {
          await cacheService.del(`error:${errorId}`)
        }
      }
    } catch (error) {
      logger.error('Failed to cleanup old errors:', error)
    }
  }

  // Private methods

  private startPerformanceMonitoring() {
    // Cleanup old data every hour
    setInterval(() => {
      this.cleanup()
    }, 60 * 60 * 1000)

    // Log performance summary every 5 minutes
    setInterval(() => {
      const stats = this.getPerformanceStats()
      logger.info('Performance summary', {
        avgResponseTime: stats.avgResponseTime,
        requestsPerSecond: stats.requestsPerSecond,
        errorRate: stats.errorRate,
        memoryUsage: Math.round(stats.memoryUsage.heapUsed / 1024 / 1024) + 'MB'
      })
    }, 5 * 60 * 1000)
  }

  private async checkDatabaseHealth(): Promise<ServiceHealth> {
    const startTime = Date.now()
    
    try {
      await this.prisma.$queryRaw`SELECT 1`
      const responseTime = Date.now() - startTime
      
      return {
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        responseTime,
        message: responseTime < 1000 ? 'Database responding normally' : 'Database response slow',
        lastCheck: new Date()
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        message: `Database connection failed: ${(error as Error).message}`,
        lastCheck: new Date()
      }
    }
  }

  private async checkCacheHealth(): Promise<ServiceHealth> {
    const startTime = Date.now()
    
    try {
      const testKey = 'health-check'
      await cacheService.set(testKey, 'test', { ttl: 10 })
      const result = await cacheService.get(testKey)
      await cacheService.del(testKey)
      
      const responseTime = Date.now() - startTime
      
      return {
        status: result === 'test' && responseTime < 500 ? 'healthy' : 'degraded',
        responseTime,
        message: result === 'test' ? 'Cache responding normally' : 'Cache response issues',
        lastCheck: new Date()
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        message: `Cache connection failed: ${(error as Error).message}`,
        lastCheck: new Date()
      }
    }
  }

  private checkMemoryHealth(): ServiceHealth {
    const memUsage = process.memoryUsage()
    const totalMemory = os.totalmem()
    const usedMemoryPercent = (memUsage.heapUsed / totalMemory) * 100
    
    let status: ServiceHealth['status'] = 'healthy'
    let message = 'Memory usage normal'
    
    if (usedMemoryPercent > 80) {
      status = 'unhealthy'
      message = 'High memory usage detected'
    } else if (usedMemoryPercent > 60) {
      status = 'degraded'
      message = 'Elevated memory usage'
    }
    
    return {
      status,
      message,
      lastCheck: new Date()
    }
  }

  private checkDiskHealth(): ServiceHealth {
    // Basic disk health check (in a real implementation, you'd check disk space)
    return {
      status: 'healthy',
      message: 'Disk space adequate',
      lastCheck: new Date()
    }
  }

  private determineOverallHealth(services: ServiceHealth[]): HealthCheckResult['status'] {
    const unhealthyCount = services.filter(s => s.status === 'unhealthy').length
    const degradedCount = services.filter(s => s.status === 'degraded').length
    
    if (unhealthyCount > 0) return 'unhealthy'
    if (degradedCount > 0) return 'degraded'
    return 'healthy'
  }

  private calculateCurrentMetrics() {
    const recentMetrics = this.metrics.slice(-50)
    
    if (recentMetrics.length === 0) {
      return {
        avgResponseTime: 0,
        requestsPerSecond: 0,
        errorRate: 0,
        memoryUsagePercent: 0,
        cpuUsagePercent: 0
      }
    }

    const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length
    const timeSpan = (recentMetrics[recentMetrics.length - 1].timestamp.getTime() - recentMetrics[0].timestamp.getTime()) / 1000
    const requestsPerSecond = timeSpan > 0 ? recentMetrics.length / timeSpan : 0
    const errorRate = this.errorCount / this.requestCount * 100
    
    const memUsage = process.memoryUsage()
    const memoryUsagePercent = (memUsage.heapUsed / os.totalmem()) * 100
    
    return {
      avgResponseTime: Math.round(avgResponseTime),
      requestsPerSecond: Math.round(requestsPerSecond * 100) / 100,
      errorRate: Math.round(errorRate * 100) / 100,
      memoryUsagePercent: Math.round(memoryUsagePercent * 100) / 100,
      cpuUsagePercent: 0 // CPU usage calculation would need more complex implementation
    }
  }

  private determineErrorLevel(error: Error): ErrorReport['level'] {
    const errorName = error.name.toLowerCase()
    const errorMessage = error.message.toLowerCase()
    
    // Fatal errors
    if (errorName.includes('fatal') || errorMessage.includes('fatal')) {
      return 'fatal'
    }
    
    // Warning level errors
    if (errorName.includes('validation') || errorName.includes('warning')) {
      return 'warn'
    }
    
    return 'error'
  }

  private generateErrorId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private getActiveConnections(): number {
    // This would need to be implemented based on your server setup
    return 0
  }

  private getUptime(): number {
    return Math.floor((Date.now() - this.startTime) / 1000)
  }
}

// Export singleton instance
export const monitoringService = new MonitoringService(new PrismaClient())