import { config } from 'dotenv';

// Load environment variables
config();

module.exports = {
  apps: [{
    name: 'corp-astro-server',
    script: './dist/app.js',
    instances: process.env.NODE_ENV === 'production' ? 'max' : 1,
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    env_staging: {
      NODE_ENV: 'staging'
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log'
  }]
};
