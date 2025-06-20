module.exports = {
  logLevel: process.env.LOG_LEVEL || 'debug',
  port: process.env.CONTAINER_PORT || 3000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:3002',
};
