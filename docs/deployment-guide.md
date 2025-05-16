# Corp Astro Server Deployment Guide

This guide provides instructions for deploying the Corp Astro Server to different environments.

## Deployment Environments

The Corp Astro Server can be deployed to the following environments:

- **Development**: Local development environment
- **Testing**: Environment for running automated tests
- **Staging**: Pre-production environment for QA
- **Production**: Live environment for end users

## Prerequisites

Before deploying the application, ensure you have the following:

- Node.js 16.x or 18.x
- PostgreSQL 14.x or later
- Redis 6.x or later
- Access to the target deployment server
- SSH key for server access
- Environment-specific configuration files

## Deployment Configuration

The `deploy-config.js` file in the root directory contains configuration settings for different environments. Review and update this file as needed before deployment.

## Deployment Methods

### 1. Manual Deployment

#### Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/Project-Corp-Astro/Corp_Astro_Server_Trial.git
   cd Corp_Astro_Server_Trial
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   # Edit .env file with your local configuration
   ```

4. Build the application:
   ```bash
   npm run build
   ```

5. Start the server:
   ```bash
   npm start
   ```

#### Staging/Production Environment

1. SSH into the server:
   ```bash
   ssh user@server
   ```

2. Clone the repository:
   ```bash
   git clone https://github.com/Project-Corp-Astro/Corp_Astro_Server_Trial.git
   cd Corp_Astro_Server_Trial
   ```

3. Install dependencies:
   ```bash
   npm install --production
   ```

4. Create environment-specific `.env` file:
   ```bash
   cp .env.example .env
   # Edit .env file with environment-specific configuration
   ```

5. Build the application:
   ```bash
   npm run build
   ```

6. Start the server using PM2:
   ```bash
   pm2 start ecosystem.config.js --env production
   ```

### 2. Automated Deployment with GitHub Actions

The repository includes a GitHub Actions workflow for automated deployment to staging and production environments. The workflow is defined in `.github/workflows/deploy.yml`.

To use the automated deployment workflow:

1. Configure the required secrets in the GitHub repository settings (see `.github/repository-secrets-setup.md`)

2. Push changes to the `main` branch to trigger deployment to staging:
   ```bash
   git push origin main
   ```

3. To deploy to production, create and push a tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

### 3. Deployment with Docker

The repository includes a Dockerfile for containerized deployment.

To deploy with Docker:

1. Build the Docker image:
   ```bash
   docker build -t corp-astro-server:latest .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env corp-astro-server:latest
   ```

For Docker Compose deployment:

1. Create a `docker-compose.yml` file:
   ```yaml
   version: '3'
   services:
     app:
       image: corp-astro-server:latest
       build: .
       ports:
         - "3000:3000"
       env_file:
         - .env
       depends_on:
         - postgres
         - redis
     postgres:
       image: postgres:14
       environment:
         POSTGRES_USER: ${DB_USER}
         POSTGRES_PASSWORD: ${DB_PASSWORD}
         POSTGRES_DB: ${DB_NAME}
       volumes:
         - postgres-data:/var/lib/postgresql/data
     redis:
       image: redis:6
       command: redis-server --requirepass ${REDIS_PASSWORD}
       volumes:
         - redis-data:/data
   volumes:
     postgres-data:
     redis-data:
   ```

2. Start the services:
   ```bash
   docker-compose up -d
   ```

## Post-Deployment Steps

After deploying the application, perform the following steps:

1. Run database migrations:
   ```bash
   npm run migrate
   ```

2. Seed initial data:
   ```bash
   npm run seed
   ```

3. Verify the deployment:
   ```bash
   curl http://localhost:3000/api/health
   ```

## Rollback Procedure

If issues are encountered after deployment, follow these steps to rollback:

1. For GitHub Actions deployment, revert to a previous commit and push:
   ```bash
   git revert [commit-hash]
   git push origin main
   ```

2. For manual deployment, checkout a previous version and redeploy:
   ```bash
   git checkout [previous-tag]
   npm install
   npm run build
   npm start
   ```

3. For Docker deployment, use a previous image tag:
   ```bash
   docker run -p 3000:3000 --env-file .env corp-astro-server:[previous-tag]
   ```

## Monitoring and Logging

After deployment, monitor the application using:

1. PM2 for process monitoring:
   ```bash
   pm2 monit
   ```

2. Application logs:
   ```bash
   pm2 logs
   # or
   tail -f logs/app.log
   ```

3. Set up external monitoring services:
   - New Relic
   - Datadog
   - Prometheus + Grafana

## Scaling

To scale the application horizontally:

1. Using PM2:
   ```bash
   pm2 scale app +3  # Add 3 more instances
   ```

2. Using Docker Compose:
   ```bash
   docker-compose up -d --scale app=3
   ```

3. Using Kubernetes:
   ```bash
   kubectl scale deployment corp-astro-server --replicas=3
   ```

## Troubleshooting

Common deployment issues and solutions:

1. **Database connection errors**:
   - Check database credentials in `.env` file
   - Verify database server is running
   - Check network connectivity and firewall rules

2. **Redis connection errors**:
   - Check Redis credentials in `.env` file
   - Verify Redis server is running
   - Check network connectivity and firewall rules

3. **Application startup failures**:
   - Check application logs for errors
   - Verify all required environment variables are set
   - Check for port conflicts

4. **Performance issues**:
   - Monitor CPU and memory usage
   - Check database query performance
   - Adjust scaling parameters in `deploy-config.js`
