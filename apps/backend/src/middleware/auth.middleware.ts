import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole, JwtPayload, ROLE_PERMISSIONS } from '@intelident/shared';
import { getRedisClient } from '../config/redis';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// Verificar JWT y sesión activa
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Token de acceso requerido', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Verificar que la sesión no esté en lista negra (Redis)
    const redis = getRedisClient();
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new AppError('Token revocado. Inicie sesión nuevamente', 401);
    }

    // Verificar sesión activa
    const sessionData = await redis.get(`session:${decoded.sessionId}`);
    if (!sessionData) {
      throw new AppError('Sesión expirada. Inicie sesión nuevamente', 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Token inválido', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expirado', 401));
    } else {
      next(error);
    }
  }
};

// Autorizar por rol
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('No autenticado', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('No tiene permisos para esta acción', 403),
      );
    }
    next();
  };
};

// Verificar permiso granular
export const checkPermission = (resource: string, action: string) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('No autenticado', 401));
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role];
    const hasPermission = userPermissions.some(
      (p) =>
        (p.resource === '*' || p.resource === resource) &&
        (p.actions as string[]).includes(action),
    );

    if (!hasPermission) {
      logger.warn(
        `Acceso denegado: usuario ${req.user.userId} intentó ${action} en ${resource}`,
      );
      return next(
        new AppError(`Permiso denegado: no puede ${action} ${resource}`, 403),
      );
    }
    next();
  };
};