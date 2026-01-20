# 🚀 CI/CD Pipeline Setup Guide

## What is CI/CD?

**CI/CD** stands for **Continuous Integration** and **Continuous Deployment**:

- **Continuous Integration (CI)**: Automatically tests your code every time you push changes
- **Continuous Deployment (CD)**: Automatically deploys your code to servers after tests pass

**GitHub Actions** is GitHub's built-in CI/CD service that runs these automated workflows.

## Why You Need CI/CD

### Without CI/CD (Manual Process)
```bash
# Every time you want to deploy:
1. Run tests manually: npm test
2. Check if tests pass
3. Build the application: npm run build
4. Upload files to server
5. Restart services
6. Hope nothing breaks
7. Fix issues manually if something goes wrong
```

### With CI/CD (Automated Process)
```bash
# You just do:
git push origin main

# GitHub Actions automatically:
1. ✅ Runs all tests
2. ✅ Builds the application
3. ✅ Scans for security issues
4. ✅ Deploys to server
5. ✅ Runs health checks
6. ✅ Notifies you if anything fails
```

## Our CI/CD Pipeline

I've created a comprehensive CI/CD pipeline for your EthioAI Tourism Platform with these workflows:

### 1. Main CI/CD Pipeline (`.github/workflows/ci.yml`)
**Triggers**: Every push to `main` or `develop` branches, and pull requests

**What it does**:
- 🧪 **Tests Backend**: Runs unit tests, integration tests, linting
- 🧪 **Tests Frontend**: Runs component tests, type checking, linting  
- 🔒 **Security Scan**: Checks for vulnerabilities in dependencies
- 🐳 **Build Docker Images**: Creates deployable containers
- 🚀 **Deploy to Staging**: Automatically deploys `develop` branch
- 🚀 **Deploy to Production**: Automatically deploys `main` branch

### 2. Extended Test Suite (`.github/workflows/test.yml`)
**Triggers**: Daily at 2 AM UTC, or manually

**What it does**:
- 🔗 **Integration Tests**: Tests API endpoints with real database
- 🌐 **End-to-End Tests**: Tests complete user workflows in browser
- ⚡ **Performance Tests**: Checks API response times and load handling

### 3. Security Monitoring (`.github/workflows/security.yml`)
**Triggers**: Weekly on Sundays, or when code changes

**What it does**:
- 🔍 **Dependency Scanning**: Finds vulnerable packages
- 🛡️ **Code Analysis**: Detects security issues in code
- 🐳 **Container Scanning**: Checks Docker images for vulnerabilities
- 🔐 **Secret Scanning**: Prevents accidental secret commits
- 🕷️ **OWASP ZAP**: Tests running application for security flaws

## Setup Instructions

### Step 1: Repository Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

#### Production Deployment
```
PRODUCTION_HOST=your-production-server.com
PRODUCTION_USER=ubuntu
PRODUCTION_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
your-private-key-here
-----END OPENSSH PRIVATE KEY-----
PRODUCTION_URL=https://your-domain.com
```

#### Staging Deployment
```
STAGING_HOST=staging.your-domain.com
STAGING_USER=ubuntu
STAGING_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
your-staging-private-key-here
-----END OPENSSH PRIVATE KEY-----
STAGING_URL=https://staging.your-domain.com
```

#### Notifications (Optional)
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

### Step 2: Server Preparation

#### Production Server Setup
```bash
# 1. Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 2. Create application directory
sudo mkdir -p /opt/ethioai-tourism-platform
sudo chown $USER:$USER /opt/ethioai-tourism-platform

# 3. Clone repository
cd /opt
git clone https://github.com/your-username/ethioai-tourism-platform.git
cd ethioai-tourism-platform

# 4. Setup environment
cp .env.example .env
# Edit .env with production values

# 5. Create Docker Compose file for production
cp docker-compose.yml docker-compose.prod.yml
# Edit docker-compose.prod.yml for production settings
```

#### SSH Key Setup
```bash
# On your local machine, generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions@your-domain.com"

# Copy public key to server
ssh-copy-id -i ~/.ssh/id_rsa.pub user@your-server.com

# Add private key to GitHub Secrets (copy the entire private key)
cat ~/.ssh/id_rsa
```

### Step 3: Environment Files

#### Server Environment (`.env`)
```env
NODE_ENV=production
DATABASE_URL=mysql://user:password@localhost:3306/ethioai_tourism
REDIS_HOST=localhost
JWT_SECRET=your-super-secure-jwt-secret-here
# ... other production values
```

#### Docker Compose for Production
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    image: ghcr.io/your-username/ethioai-tourism-platform-backend:latest
    restart: unless-stopped
    environment:
      NODE_ENV: production
    env_file:
      - .env
    ports:
      - "5000:5000"
    depends_on:
      - mysql
      - redis

  frontend:
    image: ghcr.io/your-username/ethioai-tourism-platform-frontend:latest
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro

  mysql:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ethioai_tourism
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:
```

### Step 4: Test the Pipeline

#### 1. Create a Simple Test
```bash
# Create a test file to verify the pipeline works
mkdir -p server/src/__tests__
```

Create `server/src/__tests__/health.test.ts`:
```typescript
import request from 'supertest';
import { app } from '../app';

describe('Health Check', () => {
  it('should return 200 for health endpoint', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.status).toBe('ok');
  });
});
```

#### 2. Push to Trigger Pipeline
```bash
git add .
git commit -m "Add CI/CD pipeline and basic tests"
git push origin main
```

#### 3. Monitor the Pipeline
1. Go to your GitHub repository
2. Click on "Actions" tab
3. Watch your pipeline run!

## Pipeline Stages Explained

### 🧪 Testing Stage
```yaml
# What happens:
1. Starts MySQL and Redis test databases
2. Installs dependencies
3. Runs database migrations
4. Runs unit tests
5. Runs integration tests
6. Checks code quality (linting)
7. Builds the application
```

### 🔒 Security Stage
```yaml
# What happens:
1. Scans dependencies for vulnerabilities
2. Analyzes code for security issues
3. Scans Docker images
4. Checks for accidentally committed secrets
5. Runs penetration tests (weekly)
```

### 🐳 Build Stage
```yaml
# What happens:
1. Builds Docker images for backend and frontend
2. Tags images with version numbers
3. Pushes to GitHub Container Registry
4. Images are ready for deployment
```

### 🚀 Deploy Stage
```yaml
# What happens:
1. SSH into your server
2. Pulls latest Docker images
3. Updates docker-compose configuration
4. Restarts services with zero downtime
5. Runs health checks
6. Sends notifications
```

## Monitoring Your Pipeline

### GitHub Actions Dashboard
- **Green ✅**: All tests passed, deployment successful
- **Red ❌**: Tests failed or deployment error
- **Yellow 🟡**: Pipeline is running

### Notifications
Set up Slack notifications to get alerts:
```yaml
- name: Notify deployment success
  uses: 8398a7/action-slack@v3
  if: success()
  with:
    status: success
    text: '🚀 Production deployment successful!'
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Health Checks
The pipeline automatically checks if your application is healthy after deployment:
```bash
curl -f https://your-domain.com/health || exit 1
```

## Troubleshooting Common Issues

### ❌ Tests Failing
```bash
# Check the logs in GitHub Actions
# Common issues:
1. Database connection problems
2. Missing environment variables
3. Code syntax errors
4. Dependency conflicts
```

**Solution**: Fix the code and push again. The pipeline will re-run automatically.

### ❌ Deployment Failing
```bash
# Common issues:
1. SSH connection problems
2. Docker image not found
3. Server out of disk space
4. Environment variables missing
```

**Solution**: Check server logs and GitHub Actions logs for specific errors.

### ❌ Security Scan Failing
```bash
# Common issues:
1. Vulnerable dependencies
2. Hardcoded secrets in code
3. Insecure code patterns
```

**Solution**: Update dependencies, remove secrets, fix security issues.

## Advanced Features

### Branch Protection Rules
Set up branch protection to require CI/CD checks:

1. Go to Settings → Branches
2. Add rule for `main` branch
3. Require status checks to pass
4. Require pull request reviews

### Deployment Environments
GitHub Environments provide additional security:

1. Go to Settings → Environments
2. Create "production" environment
3. Add required reviewers
4. Set deployment protection rules

### Custom Workflows
You can create custom workflows for specific needs:

```yaml
# .github/workflows/custom.yml
name: Custom Workflow
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
        type: choice
        options:
        - staging
        - production

jobs:
  custom-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to ${{ github.event.inputs.environment }}
      run: echo "Deploying to ${{ github.event.inputs.environment }}"
```

## Benefits You'll See

### 🚀 **Faster Development**
- No more manual testing and deployment
- Catch bugs before they reach production
- Deploy multiple times per day safely

### 🛡️ **Better Security**
- Automatic vulnerability scanning
- Prevent secrets from being committed
- Regular security audits

### 📊 **Better Quality**
- Consistent code standards
- Automated testing
- Performance monitoring

### 😌 **Peace of Mind**
- Rollback capabilities
- Health monitoring
- Automatic notifications

## Next Steps

1. **Set up the pipeline** following this guide
2. **Add more tests** as you develop features
3. **Monitor the dashboards** to catch issues early
4. **Iterate and improve** the pipeline over time

Your CI/CD pipeline will grow with your project, making development faster and more reliable!

---

**Need Help?** 
- Check GitHub Actions logs for specific errors
- Review this guide for common solutions
- Contact the team for complex issues