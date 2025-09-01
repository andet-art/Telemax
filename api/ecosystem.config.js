export default {
  apps: [
    {
      name: 'telemax-api',
      script: 'server.js',
      cwd: '/var/www/Telemax/api',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    }
  ]
}
