import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  logger.error(`[${req.method}] ${req.path} — ${err.message}`, {
    stack:  err.stack,
    userId: (req as any).user?.userId,
  });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors:  err.errors,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    res.status(422).json({
      success: false,
      message: 'Error de validación',
      errors:  Object.values((err as any).errors).map((e: any) => e.message),
    });
    return;
  }

  // Duplicate key MongoDB
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue || {})[0];
    res.status(409).json({
      success: false,
      message: `El campo ${field} ya está en uso`,
    });
    return;
  }

  // Error genérico (500)
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack,
    }),
  });
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
};