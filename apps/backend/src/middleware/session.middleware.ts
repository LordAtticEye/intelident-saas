import { Request, Response, NextFunction } from 'express';
import { getRedisClient } from '../config/redis';
import { Session } from '../models/Session';
import { AppError } from '../utils/AppError';
import { AuthRequest } from './auth.middleware';

export const MAX_SESSIONS = parseInt(process.env.MAX_SESSIONS_PER_USER || '3');

export const enforceSingleSession = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) return next();

    const redis = getRedisClient();
    const sessionKey = `user_sessions:${req.user.userId}`;
    const sessions = await redis.lRange(sessionKey, 0, -1);

    if (sessions.length >= MAX_SESSIONS) {
      // Revocar la sesión más antigua
      const oldestSession = sessions[sessions.length - 1];
      await redis.lRem(sessionKey, 1, oldestSession);
      await redis.del(`session:${oldestSession}`);
      await Session.findOneAndUpdate(
        { sessionId: oldestSession },
        { isActive: false },
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};