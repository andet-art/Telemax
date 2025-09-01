module.exports = {
  apps: [
    {
      name: 'telemax-api',
      script: '/var/www/Telemax/api/server.js',
      cwd: '/var/www/Telemax/api',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        MAILER_OUTBOX: '/var/www/Telemax/api/outbox'
      }
    }
  ]
};
