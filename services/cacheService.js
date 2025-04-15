// services/cacheService.js
const redisClient = require('../config/redis');

exports.getCache = async (key) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

exports.setCache = async (key, value, ttl = 60) => {
  await redisClient.setEx(key, ttl, JSON.stringify(value));
};

exports.clearCache = async (key) => {
  await redisClient.del(key);
};
