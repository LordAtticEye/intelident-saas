import { createClient } from 'redis';
import { logger } from '../utils/logger';

let redisClient: ReturnType<typeof createClient> | null = null;
let isRedisAvailable = false;

export const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    logger.warn('REDIS_URL no configurada, Redis no se iniciará');
    isRedisAvailable = false;
    return null;
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on('error', (err) => {
      logger.error('Error de Redis:', err);
      isRedisAvailable = false;
    });

    redisClient.on('connect', () => {
      logger.info('Redis conectado exitosamente');
      isRedisAvailable = true;
    });

    await redisClient.connect();
    isRedisAvailable = true;
    return redisClient;
  } catch (error) {
    logger.warn('No se pudo conectar a Redis, continuando sin Redis:', error);
    isRedisAvailable = false;
    redisClient = null;
    return null;
  }
};

export const getRedisClient = () => {
  if (!isRedisAvailable || !redisClient) {
    // Retornar un cliente mock en lugar de lanzar error
    return {
      setEx: async () => {},
      del: async () => {},
      lPush: async () => {},
      lTrim: async () => {},
      expire: async () => {},
      lRange: async () => [],
      lRem: async () => {},
      get: async () => null,
    } as any;
  }
  return redisClient;
};

export const isRedisReady = () => isRedisAvailable;