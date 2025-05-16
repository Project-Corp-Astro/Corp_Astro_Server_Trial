# Repository Secrets Setup

This document provides instructions for setting up the necessary secrets in the GitHub repository for CI/CD workflows and other automated processes.

## Required Secrets

The following secrets need to be configured in the GitHub repository settings:

### CI/CD Workflow Secrets

1. **CODECOV_TOKEN**
   - Purpose: Used to upload test coverage reports to Codecov
   - How to obtain: Sign up at [Codecov](https://codecov.io) and add your repository
   - Required by: CI workflow (`.github/workflows/ci.yml`)

2. **DEPLOY_KEY**
   - Purpose: SSH key for deploying to staging/production servers
   - How to generate: `ssh-keygen -t rsa -b 4096 -C "deploy@corp-astro.com"`
   - Required by: Deployment workflow (`.github/workflows/deploy.yml`)

3. **STAGING_SERVER**
   - Purpose: Hostname or IP address of the staging server
   - Example value: `staging.corp-astro.com` or `192.168.1.100`
   - Required by: Deployment workflow (`.github/workflows/deploy.yml`)

4. **SLACK_WEBHOOK**
   - Purpose: Webhook URL for sending deployment notifications to Slack
   - How to obtain: Create an incoming webhook in your Slack workspace
   - Required by: Deployment workflow (`.github/workflows/deploy.yml`)

### Environment-Specific Secrets

For each environment (development, staging, production), the following secrets should be configured:

1. **DB_HOST_{ENV}**
   - Purpose: Database hostname for the specific environment
   - Example: `DB_HOST_PROD`, `DB_HOST_STAGING`

2. **DB_USER_{ENV}**
   - Purpose: Database username for the specific environment
   - Example: `DB_USER_PROD`, `DB_USER_STAGING`

3. **DB_PASSWORD_{ENV}**
   - Purpose: Database password for the specific environment
   - Example: `DB_PASSWORD_PROD`, `DB_PASSWORD_STAGING`

4. **REDIS_HOST_{ENV}**
   - Purpose: Redis hostname for the specific environment
   - Example: `REDIS_HOST_PROD`, `REDIS_HOST_STAGING`

5. **REDIS_PASSWORD_{ENV}**
   - Purpose: Redis password for the specific environment
   - Example: `REDIS_PASSWORD_PROD`, `REDIS_PASSWORD_STAGING`

6. **JWT_SECRET_{ENV}**
   - Purpose: Secret key for JWT authentication
   - Example: `JWT_SECRET_PROD`, `JWT_SECRET_STAGING`
   - How to generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## Setting Up Secrets

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click on "Secrets and variables" > "Actions"
4. Click on "New repository secret"
5. Enter the name and value of the secret
6. Click "Add secret"

## Environment-Specific Secrets

For environment-specific secrets, you can create environments in GitHub:

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click on "Environments"
4. Click on "New environment"
5. Enter the name of the environment (e.g., "production", "staging")
6. Configure environment-specific secrets
7. Set up environment protection rules if needed (e.g., required reviewers)

## Secret Rotation

For security reasons, it's recommended to rotate secrets periodically:

1. Generate new credentials/keys
2. Update the secrets in GitHub repository settings
3. Update the corresponding credentials in your infrastructure

## Testing Secrets

To ensure that your secrets are properly configured, you can run the CI/CD workflows manually:

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select the workflow you want to test
4. Click "Run workflow"
5. Check the workflow logs for any errors related to missing or invalid secrets
