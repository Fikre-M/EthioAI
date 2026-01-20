# 🔧 EthioAI Tourism Platform - Troubleshooting Guide

## Overview

This comprehensive troubleshooting guide helps you diagnose and resolve common issues with the EthioAI Tourism Platform. Issues are organized by component and severity level.

## Quick Diagnostic Commands

### System Health Check
```bash
# Check all services status
./scripts/health-check.sh

# Or manually check each service:
# Backend
curl -f http://localhost:5000/health || echo "Backend DOWN"

# Database
mysql -u ethioai_user -p -e "SELECT 1" ethioai_tourism || echo "Database DOWN"

# Redis
redis-cli ping || echo "Redis DOWN"

# Frontend (if running locally)
curl -f http://localhost:3002 || echo "Frontend DOWN"
```

### Log Locations
```bash
# Application logs
tail -f server/logs/combined.log
tail -f server/logs/error.log

# System logs
sudo journalctl -u nginx -f
sudo journalctl -u mysql -f
sudo journalctl -u redis -f

# PM2 logs (if using PM2)
pm2 logs ethioai-backend
```

## Common Issues by Component

## Backend Issues

### Issue: Server Won't Start

#### Symptoms
- Application crashes on startup
- Port already in use error
- Database connection errors

#### Diagnostic Steps
```bash
# Check if port is in use
netstat -tulpn | grep :5000
lsof -i :5000

# Check environment variables
cd server
node -e "console.log(process.env.DATABASE_URL)"

# Test database connection
npm run prisma:studio

# Check Node.js version
node --version  # Should be >= 18.0.0
```

#### Solutions

**Port Already in Use**
```bash
# Find and kill process using port 5000
sudo lsof -t -i:5000 | xargs sudo kill -9

# Or use different port
export PORT=5001
npm start
```

**Database Connection Issues**
```bash
# Verify database credentials
mysql -u ethioai_user -p ethioai_tourism

# Check DATABASE_URL format
# Should be: mysql://username:password@host:port/database
echo $DATABASE_URL

# Test Prisma connection
npx prisma db pull
```

**Missing Environment Variables**
```bash
# Copy example environment file
cp .env.example .env

# Edit with your values
nano .env

# Verify required variables are set
grep -E "^[A-Z_]+" .env
```

### Issue: High Memory Usage

#### Symptoms
- Server becomes unresponsive
- Out of memory errors
- Slow response times

#### Diagnostic Steps
```bash
# Check memory usage
free -h
ps aux --sort=-%mem | head -10

# Check Node.js heap usage
node --max-old-space-size=1024 dist/server.js

# Monitor with PM2
pm2 monit
```

#### Solutions

**Memory Leaks**
```bash
# Profile memory usage
npm install -g clinic
clinic doctor -- node dist/server.js

# Use heap snapshots
node --inspect dist/server.js
# Open chrome://inspect in Chrome
```

**Optimize Memory Settings**
```bash
# Increase Node.js heap size
node --max-old-space-size=2048 dist/server.js

# PM2 configuration
pm2 start ecosystem.config.js --max-memory-restart 1G
```

### Issue: Database Query Performance

#### Symptoms
- Slow API responses
- Database timeouts
- High CPU usage on database server

#### Diagnostic Steps
```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- Check running processes
SHOW PROCESSLIST;

-- Check slow queries
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;

-- Check table sizes
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'ethioai_tourism'
ORDER BY (data_length + index_length) DESC;
```

#### Solutions

**Add Missing Indexes**
```sql
-- Common indexes for performance
CREATE INDEX idx_tours_category_status ON tours(category, status);
CREATE INDEX idx_bookings_user_date ON bookings(userId, startDate);
CREATE INDEX idx_reviews_tour_status ON reviews(tourId, status);
CREATE INDEX idx_payments_user_status ON payments(userId, status);

-- Check index usage
EXPLAIN SELECT * FROM tours WHERE category = 'Cultural' AND status = 'PUBLISHED';
```

**Optimize Queries**
```javascript
// Use pagination for large datasets
const tours = await prisma.tour.findMany({
  take: 10,
  skip: (page - 1) * 10,
  where: { status: 'PUBLISHED' },
  select: {
    id: true,
    title: true,
    price: true,
    // Only select needed fields
  }
});

// Use database-level filtering instead of application-level
const expensiveTours = await prisma.tour.findMany({
  where: {
    price: { gte: 1000 }, // Database filter
    status: 'PUBLISHED'
  }
});
```

### Issue: Authentication Problems

#### Symptoms
- Users can't log in
- JWT token errors
- Session expires immediately

#### Diagnostic Steps
```bash
# Check JWT secret configuration
echo $JWT_SECRET | wc -c  # Should be at least 32 characters

# Test token generation
node -e "
const jwt = require('jsonwebtoken');
const token = jwt.sign({userId: 'test'}, process.env.JWT_SECRET);
console.log('Token:', token);
const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log('Decoded:', decoded);
"

# Check token in request headers
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/auth/me
```

#### Solutions

**Invalid JWT Secret**
```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Update .env file
JWT_SECRET=your-new-secure-secret-here
JWT_ACCESS_SECRET=different-secret-for-access-tokens
JWT_REFRESH_SECRET=different-secret-for-refresh-tokens
```

**Token Expiration Issues**
```javascript
// server/src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: { code: 'NO_TOKEN', message: 'No token provided' }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        error: { code: 'TOKEN_EXPIRED', message: 'Token expired' }
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      error: { code: 'INVALID_TOKEN', message: 'Invalid token' }
    });
  }
};
```

## Frontend Issues

### Issue: Build Failures

#### Symptoms
- `npm run build` fails
- TypeScript compilation errors
- Missing dependencies

#### Diagnostic Steps
```bash
# Check Node.js and npm versions
node --version  # Should be >= 18.0.0
npm --version

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint
```

#### Solutions

**TypeScript Errors**
```bash
# Fix common TypeScript issues
npm run lint:fix

# Check tsconfig.json
cat tsconfig.json

# Update TypeScript
npm install -D typescript@latest
```

**Dependency Issues**
```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Check for security vulnerabilities
npm audit
npm audit fix
```

### Issue: Runtime Errors

#### Symptoms
- White screen of death
- JavaScript errors in console
- API calls failing

#### Diagnostic Steps
```bash
# Check browser console for errors
# Open Developer Tools (F12) and check Console tab

# Check network requests
# Open Developer Tools > Network tab

# Check environment variables
echo $VITE_API_URL
echo $VITE_STRIPE_PUBLISHABLE_KEY
```

#### Solutions

**API Connection Issues**
```javascript
// client/src/config/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Add error handling
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
```

**CORS Issues**
```javascript
// server/src/app.ts
app.use(cors({
  origin: [
    'http://localhost:3002',
    'https://your-domain.com',
    process.env.FRONTEND_URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Database Issues

### Issue: Connection Pool Exhaustion

#### Symptoms
- "Too many connections" errors
- Database timeouts
- Application hangs

#### Diagnostic Steps
```sql
-- Check current connections
SHOW PROCESSLIST;

-- Check connection limits
SHOW VARIABLES LIKE 'max_connections';

-- Check connection usage
SELECT 
  SUBSTRING_INDEX(host, ':', 1) AS host_short,
  COUNT(*) AS count,
  user
FROM information_schema.processlist 
GROUP BY host_short, user
ORDER BY count DESC;
```

#### Solutions

**Increase Connection Limits**
```sql
-- Temporarily increase connections
SET GLOBAL max_connections = 500;

-- Permanently in my.cnf
[mysqld]
max_connections = 500
```

**Optimize Connection Pool**
```javascript
// server/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// Connection pooling in DATABASE_URL
// mysql://user:password@host:port/database?connection_limit=20&pool_timeout=20
```

### Issue: Database Locks

#### Symptoms
- Queries hanging indefinitely
- Deadlock errors
- Slow performance

#### Diagnostic Steps
```sql
-- Check for locks
SELECT * FROM information_schema.INNODB_LOCKS;

-- Check for lock waits
SELECT * FROM information_schema.INNODB_LOCK_WAITS;

-- Check running transactions
SELECT * FROM information_schema.INNODB_TRX;

-- Kill problematic queries
KILL QUERY process_id;
```

#### Solutions

**Prevent Deadlocks**
```javascript
// Use transactions properly
const result = await prisma.$transaction(async (tx) => {
  // Always access tables in the same order
  const booking = await tx.booking.update({
    where: { id: bookingId },
    data: { status: 'CONFIRMED' }
  });
  
  const payment = await tx.payment.create({
    data: {
      bookingId: booking.id,
      amount: booking.totalPrice,
      status: 'COMPLETED'
    }
  });
  
  return { booking, payment };
});
```

## Redis Issues

### Issue: Redis Connection Failures

#### Symptoms
- Cache misses
- Session storage failures
- Notification delivery issues

#### Diagnostic Steps
```bash
# Test Redis connection
redis-cli ping

# Check Redis info
redis-cli info

# Monitor Redis commands
redis-cli monitor

# Check memory usage
redis-cli info memory
```

#### Solutions

**Connection Issues**
```bash
# Check Redis configuration
sudo nano /etc/redis/redis.conf

# Restart Redis
sudo systemctl restart redis

# Check Redis logs
sudo journalctl -u redis -f
```

**Memory Issues**
```bash
# Check Redis memory usage
redis-cli info memory

# Set memory limit
redis-cli config set maxmemory 256mb
redis-cli config set maxmemory-policy allkeys-lru

# Clear Redis cache
redis-cli flushall
```

## Payment Issues

### Issue: Stripe Payment Failures

#### Symptoms
- Payment intents fail to create
- Webhooks not received
- Card declined errors

#### Diagnostic Steps
```bash
# Test Stripe API key
curl https://api.stripe.com/v1/payment_intents \
  -u sk_test_your_key: \
  -d amount=2000 \
  -d currency=usd

# Check webhook endpoint
curl -X POST http://localhost:5000/api/payments/webhook/stripe \
  -H "Content-Type: application/json" \
  -d '{"type": "payment_intent.succeeded"}'
```

#### Solutions

**API Key Issues**
```javascript
// Verify environment
console.log('Stripe Key:', process.env.STRIPE_SECRET_KEY?.substring(0, 10));

// Test key validity
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
stripe.paymentIntents.list({ limit: 1 })
  .then(() => console.log('Stripe key valid'))
  .catch(err => console.error('Stripe key invalid:', err.message));
```

**Webhook Issues**
```javascript
// server/src/routes/payment.routes.ts
app.post('/webhook/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    // Process event
    console.log('Webhook received:', event.type);
    res.json({received: true});
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

### Issue: Chapa Payment Integration

#### Symptoms
- Chapa API errors
- Currency conversion issues
- Payment status not updating

#### Diagnostic Steps
```bash
# Test Chapa API
curl -X POST https://api.chapa.co/v1/transaction/initialize \
  -H "Authorization: Bearer YOUR_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "100",
    "currency": "ETB",
    "email": "test@example.com",
    "tx_ref": "test-tx-ref"
  }'
```

#### Solutions

**Currency Handling**
```javascript
// server/src/services/payment.service.js
const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return amount;
  
  // Use exchange rate API or fixed rates
  const rates = {
    'USD_ETB': 55.0,  // Update with current rates
    'ETB_USD': 0.018
  };
  
  const rate = rates[`${fromCurrency}_${toCurrency}`];
  return rate ? amount * rate : amount;
};
```

## Performance Issues

### Issue: Slow API Responses

#### Symptoms
- High response times (>2 seconds)
- Timeouts
- Poor user experience

#### Diagnostic Steps
```bash
# Test API response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/tours

# Create curl-format.txt:
echo "     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n" > curl-format.txt

# Monitor database queries
tail -f /var/log/mysql/slow.log
```

#### Solutions

**Database Query Optimization**
```javascript
// Add caching layer
const redis = require('ioredis');
const client = new redis(process.env.REDIS_URL);

const getCachedTours = async (filters) => {
  const cacheKey = `tours:${JSON.stringify(filters)}`;
  
  // Try cache first
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Query database
  const tours = await prisma.tour.findMany({
    where: filters,
    include: {
      guide: {
        select: {
          user: { select: { name: true, avatar: true } },
          rating: true,
          totalReviews: true
        }
      }
    }
  });
  
  // Cache for 30 minutes
  await client.setex(cacheKey, 1800, JSON.stringify(tours));
  
  return tours;
};
```

**Response Compression**
```javascript
// server/src/app.ts
const compression = require('compression');

app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

### Issue: High Memory Usage

#### Symptoms
- Server crashes with OOM errors
- Gradual memory increase
- Swap usage

#### Diagnostic Steps
```bash
# Monitor memory usage
watch -n 1 'free -h && ps aux --sort=-%mem | head -5'

# Check for memory leaks
node --inspect dist/server.js
# Open chrome://inspect

# Use heap profiling
npm install -g clinic
clinic doctor -- node dist/server.js
```

#### Solutions

**Memory Leak Prevention**
```javascript
// Proper event listener cleanup
class TourService {
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.setMaxListeners(100);
  }
  
  cleanup() {
    this.eventEmitter.removeAllListeners();
  }
}

// Limit concurrent operations
const pLimit = require('p-limit');
const limit = pLimit(10);

const processImages = async (images) => {
  return Promise.all(
    images.map(image => 
      limit(() => processImage(image))
    )
  );
};
```

## Monitoring and Alerting

### Setting Up Monitoring

#### Application Metrics
```javascript
// server/src/middleware/metrics.middleware.js
const prometheus = require('prom-client');

// Create metrics
const httpDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

const httpRequests = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status']
});

// Middleware
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;
    
    httpDuration.labels(req.method, route, res.statusCode).observe(duration);
    httpRequests.labels(req.method, route, res.statusCode).inc();
  });
  
  next();
};

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(prometheus.register.metrics());
});
```

#### Health Check Endpoint
```javascript
// server/src/routes/health.routes.js
const express = require('express');
const router = express.Router();

router.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {}
  };

  try {
    // Database check
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = 'ok';
  } catch (error) {
    health.checks.database = 'error';
    health.status = 'error';
  }

  try {
    // Redis check
    await redis.ping();
    health.checks.redis = 'ok';
  } catch (error) {
    health.checks.redis = 'error';
    health.status = 'error';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

### Alerting Rules

#### Prometheus Alerts
```yaml
# alerts.yml
groups:
- name: ethioai-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
      description: "Error rate is {{ $value }} errors per second"

  - alert: HighResponseTime
    expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High response time detected"
      description: "95th percentile response time is {{ $value }} seconds"

  - alert: DatabaseDown
    expr: up{job="mysql"} == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Database is down"
      description: "MySQL database is not responding"
```

## Emergency Procedures

### Service Recovery

#### Complete System Failure
```bash
#!/bin/bash
# emergency-recovery.sh

echo "Starting emergency recovery..."

# 1. Stop all services
pm2 stop all
sudo systemctl stop nginx
sudo systemctl stop mysql
sudo systemctl stop redis

# 2. Check disk space
df -h

# 3. Check system resources
free -h
top -bn1 | head -20

# 4. Start core services
sudo systemctl start mysql
sudo systemctl start redis

# 5. Restore from backup if needed
if [ "$1" == "restore" ]; then
  echo "Restoring from backup..."
  mysql -u root -p ethioai_tourism < /backups/mysql/latest.sql
fi

# 6. Start application services
pm2 start ecosystem.config.js
sudo systemctl start nginx

# 7. Verify services
sleep 10
curl -f http://localhost:5000/health || echo "Backend still down"
curl -f http://localhost || echo "Frontend still down"

echo "Recovery complete"
```

#### Database Recovery
```bash
#!/bin/bash
# database-recovery.sh

# 1. Stop application
pm2 stop ethioai-backend

# 2. Backup current state
mysqldump -u root -p ethioai_tourism > /tmp/pre-recovery-backup.sql

# 3. Restore from backup
mysql -u root -p ethioai_tourism < /backups/mysql/latest.sql

# 4. Run migrations
cd server
npm run prisma:migrate

# 5. Restart application
pm2 start ethioai-backend

# 6. Verify
curl -f http://localhost:5000/health
```

### Rollback Procedures

#### Application Rollback
```bash
#!/bin/bash
# rollback.sh

VERSION=$1
if [ -z "$VERSION" ]; then
  echo "Usage: ./rollback.sh <version>"
  exit 1
fi

echo "Rolling back to version $VERSION..."

# 1. Stop current version
pm2 stop ethioai-backend

# 2. Switch to previous version
cd /opt/ethioai-tourism-platform
git checkout $VERSION

# 3. Restore dependencies
cd server
npm install

# 4. Build application
npm run build

# 5. Rollback database if needed
if [ "$2" == "db" ]; then
  mysql -u root -p ethioai_tourism < /backups/mysql/pre-$VERSION.sql
fi

# 6. Start application
pm2 start ethioai-backend

echo "Rollback complete"
```

## Getting Help

### Log Analysis Tools

#### Centralized Logging
```bash
# Install ELK stack for log analysis
docker run -d --name elasticsearch \
  -p 9200:9200 -p 9300:9300 \
  -e "discovery.type=single-node" \
  elasticsearch:7.14.0

docker run -d --name kibana \
  -p 5601:5601 \
  --link elasticsearch:elasticsearch \
  kibana:7.14.0
```

#### Log Parsing
```bash
# Parse error logs
grep -E "(ERROR|FATAL)" server/logs/combined.log | tail -20

# Find slow queries
grep "Query_time" /var/log/mysql/slow.log | sort -k2 -nr | head -10

# Analyze access patterns
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -10
```

### Support Channels

#### Internal Support
- **Documentation**: Check this guide and API documentation
- **Logs**: Always include relevant log snippets
- **Environment**: Specify development/staging/production

#### External Support
- **GitHub Issues**: [Repository Issues](https://github.com/your-org/ethioai-tourism-platform/issues)
- **Email Support**: support@ethioai.com
- **Emergency Contact**: +1-XXX-XXX-XXXX (for production issues)

### Issue Reporting Template

```markdown
## Issue Description
Brief description of the problem

## Environment
- Environment: [Development/Staging/Production]
- Server OS: [Ubuntu 20.04/CentOS 8/etc.]
- Node.js Version: [18.x.x]
- Database Version: [MySQL 8.0.x]

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Error Messages
```
Paste error messages here
```

## Logs
```
Paste relevant log entries here
```

## Additional Context
Any other relevant information
```

---

**Remember**: When in doubt, check the logs first. Most issues can be diagnosed by examining application logs, database logs, and system logs. Always backup before making changes in production environments.