import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { AppError } from '../utils/AppError';
import { UserRole } from '@intelident/shared';

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== UserRole.ADMIN) {
    throw new AppError('Acceso denegado. Se requieren permisos de administrador', 403);
  }
  next();
};

export const requireRole = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError('Acceso denegado. No tienes permisos suficientes', 403);
    }
    next();
  };
};