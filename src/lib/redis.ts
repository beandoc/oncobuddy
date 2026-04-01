import Redis from 'ioredis';

const DEFAULT_REDIS_URL = 'redis://localhost:6379';

const redisClientSingleton = () => {
  return new Redis(process.env.REDIS_URL || DEFAULT_REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  });
};

declare global {
  var redis: undefined | ReturnType<typeof redisClientSingleton>;
}

export const redis = globalThis.redis ?? redisClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.redis = redis;
