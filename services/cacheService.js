const { createClient } = require("redis");

let redisClient;

if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
      tls: true,
      keepAlive: true
    }
  });

  redisClient.on("error", (err) => {
    console.error("❌ Redis error:", err.message);
  });

  redisClient.connect()
    .then(() => console.log("✅ Redis connected"))
    .catch((err) => console.error("❌ Redis connection failed:", err.message));
} else {
  console.warn("⚠️ REDIS_URL saknas – Redis-cache är inaktiverad");
}

module.exports = redisClient;
