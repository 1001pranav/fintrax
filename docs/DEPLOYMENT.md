# Fintrax Deployment Guide

This guide covers deploying Fintrax to production and staging environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [CI/CD Workflows](#cicd-workflows)
4. [Deployment Process](#deployment-process)
5. [Rollback Procedure](#rollback-procedure)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

- Git
- Node.js 20+
- Go 1.23+
- PostgreSQL 15+
- GitHub account with repository access

### Required Secrets

Configure these secrets in GitHub Settings → Secrets and Variables → Actions:

#### Backend Secrets
```
BACKEND_DEPLOY_KEY      - SSH key for backend server
BACKEND_DEPLOY_HOST     - Backend server hostname
BACKEND_DEPLOY_USER     - SSH username
DATABASE_URL            - Production database connection string
STAGING_DATABASE_URL    - Staging database connection string
JWT_SECRET              - JWT signing secret
```

#### Frontend Secrets
```
NEXT_PUBLIC_API_URL     - Production API URL
STAGING_API_URL         - Staging API URL
VERCEL_TOKEN            - Vercel deployment token (if using Vercel)
VERCEL_ORG_ID          - Vercel organization ID
VERCEL_PROJECT_ID      - Vercel project ID
```

#### Notification Secrets
```
SLACK_WEBHOOK           - Slack webhook URL for deployment notifications
```

## Environment Variables

### Backend (.env)

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=fintrax_db

# Application
APP_NAME=Fintrax
APP_PORT=8080

# Security
JWT_SECRET=your_jwt_secret_key_change_this_in_production

# CORS
CORS_ALLOWED_ORIGINS=https://fintrax.com,https://www.fintrax.com
```

### Frontend (.env.local)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.fintrax.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## CI/CD Workflows

### 1. Continuous Integration (ci.yml)

**Trigger:** Pull requests and pushes to `main` or `develop`

**Jobs:**
- Backend tests with PostgreSQL
- Backend build verification
- Frontend tests with coverage
- Frontend linting
- Frontend build verification
- E2E tests (when enabled)

**Usage:**
```bash
# Automatically runs on PR creation/update
# Check status in GitHub Actions tab
```

### 2. Production Deployment (deploy.yml)

**Trigger:** Push to `main` branch or manual dispatch

**Jobs:**
- Build and deploy backend
- Run database migrations
- Build and deploy frontend
- Health checks
- Create release tag
- Send notifications

**Manual Deployment:**
```bash
# Go to Actions → Deploy to Production → Run workflow
```

### 3. Staging Deployment (deploy-staging.yml)

**Trigger:** Push to `develop` branch or manual dispatch

**Jobs:**
- Deploy to staging environment
- Run staging migrations
- Health checks

### 4. Rollback (rollback.yml)

**Trigger:** Manual dispatch only

**Usage:**
```bash
# Go to Actions → Rollback Deployment → Run workflow
# Select version tag (e.g., v2024.01.15-1200)
# Select environment (production/staging)
```

## Deployment Process

### First-Time Setup

1. **Set up database:**
```bash
# Create production database
createdb fintrax_db

# Run migrations
cd backend
migrate -path migrations -database "postgres://user:pass@host:5432/fintrax_db?sslmode=require" up
```

2. **Configure secrets in GitHub:**
   - Navigate to Settings → Secrets and Variables → Actions
   - Add all required secrets listed above

3. **Set up deployment targets:**
   - Configure hosting (Vercel, Railway, AWS, etc.)
   - Set up domain DNS
   - Configure SSL certificates

### Regular Deployment

#### Production Deployment

1. **Merge to main:**
```bash
git checkout main
git merge develop
git push origin main
```

2. **Automatic deployment triggers**

3. **Monitor deployment:**
   - Check GitHub Actions tab
   - Monitor logs for errors
   - Verify health checks pass

4. **Post-deployment verification:**
```bash
# Check API health
curl https://api.fintrax.com/health

# Check frontend
curl https://fintrax.com

# Test key features
# - Login
# - Create project
# - Add transaction
```

#### Staging Deployment

1. **Push to develop:**
```bash
git checkout develop
git push origin develop
```

2. **Automatic staging deployment**

3. **QA Testing on staging:**
   - Test all critical user flows
   - Verify database migrations
   - Check API endpoints

## Rollback Procedure

### When to Rollback

- Critical bugs in production
- Database migration failures
- Service downtime
- Performance degradation

### Rollback Steps

1. **Identify rollback version:**
```bash
# List recent releases
git tag -l | tail -10
```

2. **Trigger rollback workflow:**
   - Go to GitHub Actions
   - Select "Rollback Deployment"
   - Click "Run workflow"
   - Enter version tag (e.g., `v2024.01.15-1200`)
   - Select environment
   - Confirm

3. **Verify rollback:**
```bash
# Check service health
curl https://fintrax.com/health

# Verify version
# Check logs for deployed version
```

4. **Database rollback (if needed):**
```bash
# Rollback migrations
cd backend
migrate -path migrations -database "$DATABASE_URL" down 1

# Or rollback to specific version
migrate -path migrations -database "$DATABASE_URL" goto VERSION
```

### Emergency Rollback (Manual)

If GitHub Actions is unavailable:

```bash
# 1. SSH to server
ssh user@server

# 2. Stop service
systemctl stop fintrax

# 3. Restore previous version
cp /backups/fintrax.backup /app/fintrax

# 4. Rollback database if needed
migrate -path migrations -database "$DATABASE_URL" down 1

# 5. Restart service
systemctl start fintrax

# 6. Check logs
journalctl -u fintrax -f
```

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing in CI
- [ ] Code reviewed and approved
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Staging deployment successful
- [ ] QA sign-off received

### During Deployment

- [ ] Monitor deployment progress
- [ ] Check build logs for errors
- [ ] Verify migrations ran successfully
- [ ] Watch health check endpoints
- [ ] Monitor error rates

### Post-Deployment

- [ ] Verify key features working
- [ ] Check error monitoring dashboard
- [ ] Monitor performance metrics
- [ ] Verify CDN cache cleared (if applicable)
- [ ] Send deployment notification
- [ ] Update release notes

## Recommended Deployment Platforms

### Backend Options

1. **Railway** (Recommended for MVP)
   - Easy setup
   - Auto-deploy from GitHub
   - Includes PostgreSQL
   - Built-in metrics

2. **Render**
   - Free tier available
   - Auto-deploy
   - Managed PostgreSQL

3. **AWS EC2 + RDS**
   - Full control
   - Scalable
   - More complex setup

### Frontend Options

1. **Vercel** (Recommended for Next.js)
   - Optimized for Next.js
   - Auto-deploy
   - Edge network
   - Free tier

2. **Netlify**
   - Easy setup
   - CDN included
   - Forms and functions

3. **AWS S3 + CloudFront**
   - Cost-effective
   - Highly scalable

## Monitoring

### Health Checks

Backend health endpoint:
```bash
GET /health
Response: { "status": "ok", "timestamp": "..." }
```

### Key Metrics to Monitor

- Response time (p50, p95, p99)
- Error rate
- CPU and memory usage
- Database connections
- Active users

### Recommended Tools

- **Sentry** - Error tracking
- **Uptime Robot** - Uptime monitoring
- **Grafana** - Metrics visualization
- **PostgreSQL logs** - Database monitoring

## Troubleshooting

### Deployment Fails

1. **Check GitHub Actions logs**
2. **Verify secrets are configured**
3. **Check build output for errors**
4. **Verify network connectivity**

### Migration Fails

1. **Check migration files for syntax errors**
2. **Verify database connection**
3. **Check for conflicting migrations**
4. **Rollback and fix migration**

### Service Won't Start

1. **Check application logs**
2. **Verify environment variables**
3. **Check port availability**
4. **Verify database connectivity**

### High Error Rate After Deployment

1. **Check error monitoring (Sentry)**
2. **Review recent code changes**
3. **Check database status**
4. **Consider rollback if critical**

## Security Considerations

1. **Secrets Management:**
   - Never commit secrets to repository
   - Use GitHub Secrets for CI/CD
   - Rotate secrets regularly

2. **Database:**
   - Use SSL connections
   - Regular backups
   - Restrict network access

3. **API:**
   - Rate limiting enabled
   - CORS properly configured
   - JWT tokens secure

4. **SSL/TLS:**
   - Force HTTPS
   - Valid certificates
   - HSTS headers

## Support

For deployment issues:
1. Check logs in GitHub Actions
2. Review error monitoring dashboard
3. Consult this documentation
4. Contact DevOps team

---

**Last Updated:** November 15, 2025
**Version:** 1.0
