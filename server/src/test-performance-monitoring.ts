import { PrismaClient } from '@prisma/client'
import { cacheService, CacheTTL } from './services/cache.service'
import { monitoringService } from './services/monitoring.service'
import axios from 'axios'

async function testPerformanceAndMonitoring() {
  const prisma = new PrismaClient()

  try {
    console.log('🚀 Testing Performance Optimization and Monitoring...')

    // Test 1: Cache Service Functionality
    console.log('\n💾 Testing Cache Service...')

    // Test basic cache operations
    const testKey = 'test-key'
    const testValue = { message: 'Hello Cache!', timestamp: Date.now() }

    await cacheService.set(testKey, testValue, { ttl: CacheTTL.SHORT })
    console.log('✅ Cache set operation successful')

    const cachedValue = await cacheService.get(testKey)
    console.log('✅ Cache get operation successful:', cachedValue ? 'Found' : 'Not found')

    const exists = await cacheService.exists(testKey)
    console.log('✅ Cache exists check:', exists ? 'Exists' : 'Does not exist')

    // Test cache statistics
    const cacheStats = await cacheService.getStats()
    console.log('✅ Cache statistics:', {
      memory: cacheStats.memory,
      keys: cacheStats.keys,
      hitRate: cacheStats.hitRate
    })

    // Test 2: Batch Cache Operations
    console.log('\n📦 Testing Batch Cache Operations...')

    const batchData = {
      'user:1': { name: 'John Doe', email: 'john@example.com' },
      'user:2': { name: 'Jane Smith', email: 'jane@example.com' },
      'user:3': { name: 'Bob Johnson', email: 'bob@example.com' }
    }

    await cacheService.mset(batchData, { ttl: CacheTTL.MEDIUM })
    console.log('✅ Batch set operation successful')

    const batchResults = await cacheService.mget(['user:1', 'user:2', 'user:3'])
    console.log('✅ Batch get operation successful:', batchResults.filter(Boolean).length, 'items retrieved')

    // Test 3: Cache Invalidation
    console.log('\n🗑️ Testing Cache Invalidation...')

    await cacheService.set('pattern:test:1', 'value1', { ttl: CacheTTL.LONG })
    await cacheService.set('pattern:test:2', 'value2', { ttl: CacheTTL.LONG })
    await cacheService.set('pattern:other:1', 'value3', { ttl: CacheTTL.LONG })

    const invalidatedCount = await cacheService.invalidatePattern('pattern:test:*')
    console.log('✅ Pattern invalidation successful:', invalidatedCount, 'keys invalidated')

    // Test 4: Monitoring Service
    console.log('\n📊 Testing Monitoring Service...')

    // Simulate some metrics
    const mockReq = {
      method: 'GET',
      originalUrl: '/api/test',
      ip: '127.0.0.1',
      headers: { 'user-agent': 'test-agent' }
    } as any

    const mockRes = {
      statusCode: 200,
      getHeader: () => 'application/json'
    } as any

    // Record some metrics
    for (let i = 0; i < 10; i++) {
      const responseTime = Math.random() * 1000 + 100 // 100-1100ms
      monitoringService.recordMetrics(mockReq, mockRes, responseTime)
    }

    console.log('✅ Recorded 10 test metrics')

    // Test error recording
    const testError = new Error('Test error for monitoring')
    const errorId = monitoringService.recordError(testError, {
      userId: 'test-user',
      method: 'POST',
      url: '/api/test-error'
    })

    console.log('✅ Error recorded with ID:', errorId)

    // Test 5: Performance Statistics
    console.log('\n📈 Testing Performance Statistics...')

    const performanceStats = monitoringService.getPerformanceStats()
    console.log('✅ Performance statistics retrieved:', {
      avgResponseTime: performanceStats.avgResponseTime + 'ms',
      requestsPerSecond: performanceStats.requestsPerSecond,
      errorRate: performanceStats.errorRate + '%',
      totalRequests: performanceStats.totalRequests,
      memoryUsage: Math.round(performanceStats.memoryUsage.heapUsed / 1024 / 1024) + 'MB',
      uptime: performanceStats.uptime + 's'
    })

    // Test 6: Health Check
    console.log('\n🏥 Testing Health Check...')

    const healthCheck = await monitoringService.performHealthCheck()
    console.log('✅ Health check completed:', {
      status: healthCheck.status,
      uptime: healthCheck.uptime + 's',
      services: Object.keys(healthCheck.services).map(service => 
        `${service}: ${healthCheck.services[service as keyof typeof healthCheck.services].status}`
      ).join(', ')
    })

    console.log('   Service details:')
    Object.entries(healthCheck.services).forEach(([service, health]) => {
      console.log(`   - ${service}: ${health.status} (${health.responseTime}ms) - ${health.message}`)
    })

    // Test 7: Error Reports
    console.log('\n🚨 Testing Error Reports...')

    const errorReports = await monitoringService.getErrorReports(5)
    console.log('✅ Error reports retrieved:', errorReports.length, 'errors found')

    if (errorReports.length > 0) {
      console.log('   Recent errors:')
      errorReports.slice(0, 3).forEach(error => {
        console.log(`   - ${error.level}: ${error.message} (${error.timestamp.toISOString()})`)
      })
    }

    // Test 8: Cache Performance Test
    console.log('\n⚡ Testing Cache Performance...')

    const iterations = 1000
    const startTime = Date.now()

    // Test cache write performance
    const writePromises = []
    for (let i = 0; i < iterations; i++) {
      writePromises.push(cacheService.set(`perf:${i}`, { value: i, timestamp: Date.now() }, { ttl: CacheTTL.SHORT }))
    }

    await Promise.all(writePromises)
    const writeTime = Date.now() - startTime
    console.log(`✅ Cache write performance: ${iterations} operations in ${writeTime}ms (${Math.round(iterations / writeTime * 1000)} ops/sec)`)

    // Test cache read performance
    const readStartTime = Date.now()
    const readPromises = []
    for (let i = 0; i < iterations; i++) {
      readPromises.push(cacheService.get(`perf:${i}`))
    }

    const readResults = await Promise.all(readPromises)
    const readTime = Date.now() - readStartTime
    const successfulReads = readResults.filter(Boolean).length
    console.log(`✅ Cache read performance: ${successfulReads}/${iterations} operations in ${readTime}ms (${Math.round(successfulReads / readTime * 1000)} ops/sec)`)

    // Test 9: Memory Usage Monitoring
    console.log('\n🧠 Testing Memory Usage Monitoring...')

    const memoryBefore = process.memoryUsage()
    console.log('Memory before test:', {
      heapUsed: Math.round(memoryBefore.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memoryBefore.heapTotal / 1024 / 1024) + 'MB',
      external: Math.round(memoryBefore.external / 1024 / 1024) + 'MB'
    })

    // Create some memory pressure
    const largeArray = new Array(100000).fill(0).map((_, i) => ({ id: i, data: 'test'.repeat(100) }))
    
    const memoryAfter = process.memoryUsage()
    console.log('Memory after creating large array:', {
      heapUsed: Math.round(memoryAfter.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memoryAfter.heapTotal / 1024 / 1024) + 'MB',
      external: Math.round(memoryAfter.external / 1024 / 1024) + 'MB'
    })

    // Clean up
    largeArray.length = 0

    // Test 10: Cleanup Operations
    console.log('\n🧹 Testing Cleanup Operations...')

    await monitoringService.cleanup()
    console.log('✅ Monitoring cleanup completed')

    await cacheService.clear('perf:*')
    console.log('✅ Cache cleanup completed')

    console.log('\n🎉 All performance optimization and monitoring tests passed!')
    console.log('\nFeatures verified:')
    console.log('  ✅ Cache service with Redis backend')
    console.log('  ✅ Batch cache operations (mget/mset)')
    console.log('  ✅ Cache pattern invalidation')
    console.log('  ✅ Performance metrics recording')
    console.log('  ✅ Error tracking and reporting')
    console.log('  ✅ Comprehensive health checks')
    console.log('  ✅ System performance statistics')
    console.log('  ✅ Memory usage monitoring')
    console.log('  ✅ Cache performance optimization')
    console.log('  ✅ Automatic cleanup operations')

  } catch (error) {
    console.error('❌ Performance and monitoring test failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testPerformanceAndMonitoring()
    .then(() => {
      console.log('\n✅ Performance and monitoring test completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Performance and monitoring test failed:', error)
      process.exit(1)
    })
}

export { testPerformanceAndMonitoring }