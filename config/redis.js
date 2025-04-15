// config/redis.js
const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    tls: (process.env.REDIS_URL || '').startsWith('rediss://'),
  },
});

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err.message);
});

redisClient.connect()
  .then(() => console.log('✅ Redis connected'))
  .catch((err) => console.error('❌ Redis connection failed:', err.message));

module.exports = redisClient;
