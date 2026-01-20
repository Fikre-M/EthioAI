# 🚀 EthioAI Tourism Platform - Deployment Guide

## Overview

This guide covers the deployment of the EthioAI Tourism Platform, which consists of a React frontend, Node.js/Express backend, MySQL database, and Redis for caching and notifications.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React/Vite)  │◄──►│   (Node.js)     │◄──►│   (MySQL)       │
│   Port: 3002    │    │   Port: 5000    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Redis         │
                       │   Port: 6379    │
                       └─────────────────┘
```

## Prerequisites

### System Requirements
- **Node.js**: 18.0.0 or higher
- **MySQL**: 8.0 or higher
- **Redis**: 6.0 or higher
- **Memory**: Minimum 2GB RAM (4GB recommended)
- **Storage**: Minimum 10GB free space
- **OS**: Ubuntu 20.04+, CentOS 8+, or Windows Server 2019+

### Required Services
- **Cloudinary**: For image storage and processing
- **Stripe**: For payment processing
- **Chapa**: For Ethiopian payment processing
- **Firebase**: For push notifications
- **OpenAI**: For AI chat functionality
- **Email Service**: SMTP server for notifications

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/ethioai-tourism-platform.git
cd ethioai-tourism-platform
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
cd server
npm install
```

#### Frontend Dependencies
```bash
cd client
npm install
```

### 3. Environment Configuration

#### Backend Environment (.env)
```bash
# Copy example environment file
cd server
cp .env.example .env
```

Edit `server/.env` with your configuration:
```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/ethioai_tourism"

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_ACCESS_SECRET=your-access-token-secret-different-from-jwt
JWT_REFRESH_SECRET=your-refresh-token-secret-also-different
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Client Configuration
CLIENT_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@ethioai.com

# File Upload Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
MAX_FILE_SIZE=5242880

# Payment Configuration
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
CHAPA_SECRET_KEY=your-chapa-secret-key
CHAPA_PUBLIC_KEY=your-chapa-public-key

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-firebase-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Security Configuration
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging Configuration
LOG_LEVEL=info

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=1000
```

#### Frontend Environment (.env)
```bash
cd client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=https://api.your-domain.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
VITE_CHAPA_PUBLIC_KEY=your-chapa-public-key
VITE_FIREBASE_CONFIG={"apiKey":"...","authDomain":"..."}
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

## Database Setup

### 1. MySQL Installation

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

#### CentOS/RHEL
```bash
sudo yum install mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld
sudo mysql_secure_installation
```

### 2. Database Creation
```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE ethioai_tourism CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'ethioai_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON ethioai_tourism.* TO 'ethioai_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Run Migrations
```bash
cd server
npm run prisma:generate
npm run prisma:migrate
```

## Redis Setup

### Installation

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

#### CentOS/RHEL
```bash
sudo yum install epel-release
sudo yum install redis
sudo systemctl start redis
sudo systemctl enable redis
```

### Configuration
Edit `/etc/redis/redis.conf`:
```conf
# Bind to specific interface (optional)
bind 127.0.0.1

# Set password
requirepass your-redis-password

# Enable persistence
save 900 1
save 300 10
save 60 10000
```

Restart Redis:
```bash
sudo systemctl restart redis
```

## Application Build

### 1. Build Backend
```bash
cd server
npm run build
```

### 2. Build Frontend
```bash
cd client
npm run build
```

## Deployment Options

## Option 1: Traditional Server Deployment

### 1. Process Manager (PM2)

#### Install PM2
```bash
npm install -g pm2
```

#### Backend PM2 Configuration
Create `server/ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'ethioai-backend',
    script: 'dist/server.js',
    cwd: '/path/to/server',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/log/ethioai/backend-error.log',
    out_file: '/var/log/ethioai/backend-out.log',
    log_file: '/var/log/ethioai/backend.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

#### Start Backend
```bash
cd server
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 2. Web Server (Nginx)

#### Install Nginx
```bash
# Ubuntu/Debian
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

#### Nginx Configuration
Create `/etc/nginx/sites-available/ethioai`:
```nginx
# Backend API
server {
    listen 80;
    server_name api.your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.your-domain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
    
    # Proxy to Node.js backend
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # File upload size
    client_max_body_size 10M;
    
    # Logging
    access_log /var/log/nginx/ethioai-api-access.log;
    error_log /var/log/nginx/ethioai-api-error.log;
}

# Frontend
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    
    # Document root
    root /path/to/client/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Logging
    access_log /var/log/nginx/ethioai-frontend-access.log;
    error_log /var/log/nginx/ethioai-frontend-error.log;
}
```

#### Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/ethioai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d your-domain.com -d www.your-domain.com -d api.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Option 2: Docker Deployment

### 1. Backend Dockerfile
Create `server/Dockerfile`:
```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start application
CMD ["npm", "start"]
```

### 2. Frontend Dockerfile
Create `client/Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  # Database
  mysql:
    image: mysql:8.0
    container_name: ethioai-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ethioai_tourism
      MYSQL_USER: ethioai_user
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./server/prisma/schema.prisma:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "3306:3306"
    networks:
      - ethioai-network

  # Redis
  redis:
    image: redis:7-alpine
    container_name: ethioai-redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - ethioai-network

  # Backend
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: ethioai-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: mysql://ethioai_user:${MYSQL_PASSWORD}@mysql:3306/ethioai_tourism
      REDIS_HOST: redis
      REDIS_PASSWORD: ${REDIS_PASSWORD}
    env_file:
      - ./server/.env
    ports:
      - "5000:5000"
    depends_on:
      - mysql
      - redis
    networks:
      - ethioai-network
    volumes:
      - ./server/logs:/app/logs

  # Frontend
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    container_name: ethioai-frontend
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    networks:
      - ethioai-network
    volumes:
      - ./ssl:/etc/nginx/ssl:ro

volumes:
  mysql_data:
  redis_data:

networks:
  ethioai-network:
    driver: bridge
```

### 4. Deploy with Docker Compose
```bash
# Create environment file
cp .env.example .env
# Edit .env with your values

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale backend
docker-compose up -d --scale backend=3
```

## Option 3: Cloud Deployment (AWS)

### 1. AWS Infrastructure Setup

#### VPC and Security Groups
```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create subnets
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.2.0/24 --availability-zone us-east-1b

# Create security groups
aws ec2 create-security-group --group-name ethioai-web --description "Web servers"
aws ec2 create-security-group --group-name ethioai-db --description "Database servers"
```

#### RDS MySQL Setup
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier ethioai-mysql \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0.35 \
  --allocated-storage 20 \
  --storage-type gp2 \
  --db-name ethioai_tourism \
  --master-username admin \
  --master-user-password SecurePassword123 \
  --vpc-security-group-ids sg-xxx \
  --db-subnet-group-name ethioai-subnet-group \
  --backup-retention-period 7 \
  --multi-az \
  --storage-encrypted
```

#### ElastiCache Redis Setup
```bash
# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id ethioai-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --security-group-ids sg-xxx \
  --cache-subnet-group-name ethioai-cache-subnet
```

### 2. EC2 Deployment

#### Launch EC2 Instances
```bash
# Launch web servers
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --count 2 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-group-ids sg-xxx \
  --subnet-id subnet-xxx \
  --user-data file://user-data.sh
```

#### User Data Script (user-data.sh)
```bash
#!/bin/bash
yum update -y
yum install -y docker git

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Start Docker
systemctl start docker
systemctl enable docker

# Clone repository
cd /opt
git clone https://github.com/your-org/ethioai-tourism-platform.git
cd ethioai-tourism-platform

# Setup environment
cp .env.example .env
# Configure environment variables

# Deploy application
docker-compose up -d
```

### 3. Load Balancer Setup

#### Application Load Balancer
```bash
# Create load balancer
aws elbv2 create-load-balancer \
  --name ethioai-alb \
  --subnets subnet-xxx subnet-yyy \
  --security-groups sg-xxx

# Create target group
aws elbv2 create-target-group \
  --name ethioai-backend \
  --protocol HTTP \
  --port 5000 \
  --vpc-id vpc-xxx \
  --health-check-path /health

# Register targets
aws elbv2 register-targets \
  --target-group-arn arn:aws:elasticloadbalancing:... \
  --targets Id=i-xxx Id=i-yyy
```

## Option 4: Kubernetes Deployment

### 1. Kubernetes Manifests

#### Namespace
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ethioai
```

#### ConfigMap
```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ethioai-config
  namespace: ethioai
data:
  NODE_ENV: "production"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
```

#### Secrets
```yaml
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: ethioai-secrets
  namespace: ethioai
type: Opaque
data:
  DATABASE_URL: <base64-encoded-url>
  JWT_SECRET: <base64-encoded-secret>
  REDIS_PASSWORD: <base64-encoded-password>
```

#### Backend Deployment
```yaml
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ethioai-backend
  namespace: ethioai
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ethioai-backend
  template:
    metadata:
      labels:
        app: ethioai-backend
    spec:
      containers:
      - name: backend
        image: your-registry/ethioai-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: ethioai-config
              key: NODE_ENV
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: ethioai-secrets
              key: DATABASE_URL
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### Services
```yaml
# k8s/services.yaml
apiVersion: v1
kind: Service
metadata:
  name: ethioai-backend-service
  namespace: ethioai
spec:
  selector:
    app: ethioai-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 5000
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: redis-service
  namespace: ethioai
spec:
  selector:
    app: redis
  ports:
  - protocol: TCP
    port: 6379
    targetPort: 6379
```

#### Ingress
```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ethioai-ingress
  namespace: ethioai
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  tls:
  - hosts:
    - api.your-domain.com
    - your-domain.com
    secretName: ethioai-tls
  rules:
  - host: api.your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ethioai-backend-service
            port:
              number: 80
  - host: your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ethioai-frontend-service
            port:
              number: 80
```

### 2. Deploy to Kubernetes
```bash
# Apply manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n ethioai
kubectl get services -n ethioai
kubectl get ingress -n ethioai

# View logs
kubectl logs -f deployment/ethioai-backend -n ethioai
```

## Monitoring and Logging

### 1. Application Monitoring

#### Health Checks
The application includes health check endpoints:
- Backend: `GET /health`
- Database connectivity check
- Redis connectivity check
- External service checks

#### Metrics Collection
```javascript
// server/src/middleware/metrics.middleware.js
const prometheus = require('prom-client');

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

// Middleware
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
    
    httpRequestTotal
      .labels(req.method, route, res.statusCode)
      .inc();
  });
  
  next();
};

module.exports = { metricsMiddleware };
```

### 2. Logging Configuration

#### Winston Logger Setup
```javascript
// server/src/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ethioai-backend' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = { logger };
```

### 3. External Monitoring Tools

#### Prometheus + Grafana
```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources

volumes:
  prometheus_data:
  grafana_data:
```

## Security Considerations

### 1. Environment Security
- Use strong passwords for all services
- Enable firewall and configure security groups
- Regular security updates
- Use SSL/TLS for all communications
- Implement proper CORS policies

### 2. Application Security
- Input validation and sanitization
- SQL injection prevention (Prisma ORM)
- XSS protection
- CSRF protection
- Rate limiting
- JWT token security

### 3. Infrastructure Security
- Network segmentation
- Database encryption at rest
- Backup encryption
- Access logging
- Intrusion detection

## Backup and Recovery

### 1. Database Backup
```bash
#!/bin/bash
# backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mysql"
DB_NAME="ethioai_tourism"

# Create backup directory
mkdir -p $BACKUP_DIR

# MySQL backup
mysqldump -u root -p$MYSQL_ROOT_PASSWORD \
  --single-transaction \
  --routines \
  --triggers \
  $DB_NAME > $BACKUP_DIR/ethioai_${DATE}.sql

# Compress backup
gzip $BACKUP_DIR/ethioai_${DATE}.sql

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/ethioai_${DATE}.sql.gz \
  s3://your-backup-bucket/mysql/

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

### 2. Redis Backup
```bash
#!/bin/bash
# backup-redis.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/redis"

# Create backup directory
mkdir -p $BACKUP_DIR

# Redis backup
redis-cli --rdb $BACKUP_DIR/redis_${DATE}.rdb

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/redis_${DATE}.rdb \
  s3://your-backup-bucket/redis/

# Clean old backups
find $BACKUP_DIR -name "*.rdb" -mtime +7 -delete
```

### 3. Automated Backup Schedule
```bash
# Add to crontab
crontab -e

# Daily database backup at 2 AM
0 2 * * * /path/to/backup-database.sh

# Hourly Redis backup
0 * * * * /path/to/backup-redis.sh

# Weekly full system backup
0 3 * * 0 /path/to/full-backup.sh
```

## Performance Optimization

### 1. Database Optimization
```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_tours_category ON tours(category);
CREATE INDEX idx_tours_status_featured ON tours(status, featured);
CREATE INDEX idx_bookings_user_status ON bookings(userId, status);
CREATE INDEX idx_bookings_start_date ON bookings(startDate);

-- Optimize queries
ANALYZE TABLE tours;
ANALYZE TABLE bookings;
ANALYZE TABLE users;
```

### 2. Redis Caching Strategy
```javascript
// server/src/services/cache.service.js
const redis = require('ioredis');
const client = new redis(process.env.REDIS_URL);

class CacheService {
  async get(key) {
    try {
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      await client.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key) {
    try {
      await client.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  // Cache patterns
  async cacheTours(filters) {
    const key = `tours:${JSON.stringify(filters)}`;
    let tours = await this.get(key);
    
    if (!tours) {
      tours = await tourService.getTours(filters);
      await this.set(key, tours, 1800); // 30 minutes
    }
    
    return tours;
  }
}

module.exports = new CacheService();
```

### 3. CDN Configuration
```javascript
// Cloudinary optimization
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Optimized image URLs
const getOptimizedImageUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    quality: 'auto',
    fetch_format: 'auto',
    width: options.width || 800,
    height: options.height,
    crop: options.crop || 'fill',
    ...options
  });
};
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check MySQL status
sudo systemctl status mysql

# Check connection
mysql -u ethioai_user -p -h localhost ethioai_tourism

# Check logs
sudo tail -f /var/log/mysql/error.log
```

#### 2. Redis Connection Issues
```bash
# Check Redis status
sudo systemctl status redis

# Test connection
redis-cli ping

# Check logs
sudo tail -f /var/log/redis/redis-server.log
```

#### 3. Application Startup Issues
```bash
# Check PM2 processes
pm2 list
pm2 logs ethioai-backend

# Check application logs
tail -f server/logs/combined.log
tail -f server/logs/error.log
```

#### 4. Memory Issues
```bash
# Check memory usage
free -h
ps aux --sort=-%mem | head

# Check Node.js memory
pm2 monit
```

### Performance Issues

#### 1. Slow Database Queries
```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- Check slow queries
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;
```

#### 2. High CPU Usage
```bash
# Check CPU usage
top -p $(pgrep -f "node")
htop

# Profile Node.js application
npm install -g clinic
clinic doctor -- node dist/server.js
```

## Maintenance

### Regular Maintenance Tasks

#### Daily
- Monitor application logs
- Check system resources
- Verify backup completion
- Monitor error rates

#### Weekly
- Update dependencies
- Review security logs
- Performance analysis
- Database maintenance

#### Monthly
- Security updates
- Capacity planning
- Backup testing
- Documentation updates

### Update Procedures

#### Application Updates
```bash
# 1. Backup current version
cp -r /opt/ethioai-tourism-platform /opt/ethioai-backup-$(date +%Y%m%d)

# 2. Pull latest code
cd /opt/ethioai-tourism-platform
git pull origin main

# 3. Update dependencies
cd server && npm install
cd ../client && npm install

# 4. Run migrations
cd ../server && npm run prisma:migrate

# 5. Build applications
npm run build
cd ../client && npm run build

# 6. Restart services
pm2 restart ethioai-backend
sudo systemctl reload nginx
```

#### Database Updates
```bash
# 1. Backup database
mysqldump -u root -p ethioai_tourism > backup_$(date +%Y%m%d).sql

# 2. Run migrations
cd server
npm run prisma:migrate

# 3. Verify migration
npm run prisma:studio
```

## Support and Documentation

### Getting Help
- **Documentation**: [https://docs.ethioai.com](https://docs.ethioai.com)
- **Support Email**: support@ethioai.com
- **GitHub Issues**: [https://github.com/your-org/ethioai-tourism-platform/issues](https://github.com/your-org/ethioai-tourism-platform/issues)

### Additional Resources
- [API Documentation](./API_DOCUMENTATION.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Security Best Practices](./SECURITY.md)
- [Performance Tuning](./PERFORMANCE.md)

---

**Note**: This deployment guide covers multiple deployment scenarios. Choose the option that best fits your infrastructure requirements and expertise level. For production deployments, always follow security best practices and conduct thorough testing before going live.