import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/AppError';

export const validate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    // ✅ Pasar el error a next() en lugar de lanzarlo directamente
    return next(new AppError('Error de validación', 422, messages));
  }
  
  next();
};