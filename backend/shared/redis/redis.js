import Redis from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_URL
});

redis.on('connect', () => {
    console.log('Redis connected');
});

export default redis;