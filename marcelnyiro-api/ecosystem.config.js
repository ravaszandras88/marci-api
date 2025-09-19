module.exports = {
  apps: [{
    name: 'marci-api',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/marci-api',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3002
    }
  }]
};