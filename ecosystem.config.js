module.exports = {
  apps: [
    {
      name: 'corp-astro-server',
      script: 'dist/app.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      time: true,
    },
    {
      name: 'corp-astro-worker',
      script: 'dist/worker.js',
      instances: 2,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_staging: {
        NODE_ENV: 'staging',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: 'logs/worker-error.log',
      out_file: 'logs/worker-out.log',
      time: true,
    },
  ],

  deploy: {
    staging: {
      user: 'deploy',
      host: ['staging.corp-astro.com'],
      ref: 'origin/main',
      repo: 'https://github.com/Project-Corp-Astro/Corp_Astro_Server_Trial.git',
      path: '/var/www/corp-astro-server-staging',
      'post-deploy':
        'npm ci && npm run build && pm2 reload ecosystem.config.js --env staging',
      env: {
        NODE_ENV: 'staging',
      },
    },
    production: {
      user: 'deploy',
      host: ['prod.corp-astro.com'],
      ref: 'origin/main',
      repo: 'https://github.com/Project-Corp-Astro/Corp_Astro_Server_Trial.git',
      path: '/var/www/corp-astro-server-production',
      'post-deploy':
        'npm ci && npm run build && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production',
      },
    },
  },
};
