import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../utils/AppError';
import { UserRole } from '@intelident/shared';
import { crmService } from '../services/CRMService';
import { logger } from '../utils/logger';

export class AuthController {
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, accessToken, refreshToken } = await authService.register(req.body);
      
      // Crear registro CRM para el nuevo paciente
      try {
        await crmService.createPatientRecord(user._id.toString(), req.body.source || 'web');
        logger.info(`CRM record created for new patient: ${user._id}`);
      } catch (crmError) {
        logger.warn('Error creating CRM record:', crmError);
        // No bloquear el registro si CRM falla
      }
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      
      res.status(201).json({ success: true, data: { user, accessToken } });
    } catch (err) { 
      next(err); 
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await authService.login(
        email, password,
        req.headers['user-agent'] ?? '',
        req.ip ?? '',
      );
      
      // Registrar interacción en CRM
      try {
        await crmService.addInteraction(user._id.toString(), {
          type: 'web',
          date: new Date(),
          notes: 'Usuario inició sesión',
          handledBy: user._id,
        });
      } catch (crmError) {
        logger.warn('Error logging interaction:', crmError);
      }
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      
      res.json({ success: true, data: { user, accessToken } });
    } catch (err) { 
      next(err); 
    }
  };

  logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new AppError('Token no proporcionado', 401);
      
      const token = authHeader.split(' ')[1];
      if (!token) throw new AppError('Token inválido', 401);
      
      await authService.logout(token, req.user!);
      res.clearCookie('refreshToken');
      res.json({ success: true, message: 'Sesión cerrada correctamente' });
    } catch (err) { 
      next(err); 
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken || typeof refreshToken !== 'string') {
        throw new AppError('Refresh token no encontrado o inválido', 401);
      }
      const { accessToken } = await authService.refreshAccessToken(refreshToken);
      res.json({ success: true, data: { accessToken } });
    } catch (err) { 
      next(err); 
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await authService.forgotPassword(req.body.email);
      res.json({
        success: true,
        message: 'Si el email existe, recibirás instrucciones en breve',
      });
    } catch (err) { 
      next(err); 
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.params.token;
      if (!token || typeof token !== 'string') {
        throw new AppError('Token inválido', 400);
      }
      await authService.resetPassword(token, req.body.password);
      res.json({ success: true, message: 'Contraseña restablecida correctamente' });
    } catch (err) { 
      next(err); 
    }
  };

  getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { User } = await import('../models/User');
      const userId = req.user?.userId;
      if (!userId || typeof userId !== 'string') {
        throw new AppError('Usuario no autenticado', 401);
      }
      const user = await User.findById(userId).select('-password');
      if (!user) throw new AppError('Usuario no encontrado', 404);
      res.json({ success: true, data: { user } });
    } catch (err) { 
      next(err); 
    }
  };

  // ─── Nuevos métodos para ADMIN y CRM ─────────────────────────────────────────

  /**
   * Crear usuario administrador (solo desarrollo o con clave secreta)
   */
  createAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { secretKey, ...userData } = req.body;
      
      // Verificar clave secreta para crear admin
      const adminSecretKey = process.env.ADMIN_SECRET_KEY;
      if (adminSecretKey && secretKey !== adminSecretKey) {
        throw new AppError('No autorizado para crear administrador', 403);
      }
      
      const user = await authService.createAdmin(userData);
      
      res.status(201).json({ 
        success: true, 
        data: { user },
        message: 'Administrador creado exitosamente'
      });
    } catch (err) { 
      next(err); 
    }
  };

  /**
   * Obtener todos los usuarios (solo admin)
   */
  getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { User } = await import('../models/User');
      const users = await User.find({}).select('-password');
      res.json({ success: true, data: { users } });
    } catch (err) { 
      next(err); 
    }
  };

  /**
   * Cambiar rol de usuario (solo admin)
   */
  changeUserRole = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      
      if (!Object.values(UserRole).includes(role)) {
        throw new AppError('Rol inválido', 400);
      }
      
      const { User } = await import('../models/User');
      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!user) throw new AppError('Usuario no encontrado', 404);
      
      res.json({ success: true, data: { user }, message: 'Rol actualizado exitosamente' });
    } catch (err) { 
      next(err); 
    }
  };

  /**
   * Activar/desactivar usuario (solo admin)
   */
  toggleUserStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;
      
      const { User } = await import('../models/User');
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive },
        { new: true }
      ).select('-password');
      
      if (!user) throw new AppError('Usuario no encontrado', 404);
      
      res.json({ 
        success: true, 
        data: { user }, 
        message: `Usuario ${isActive ? 'activado' : 'desactivado'} exitosamente` 
      });
    } catch (err) { 
      next(err); 
    }
  };

  /**
   * Obtener estadísticas del dashboard (admin y dentistas)
   */
  getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { User } = await import('../models/User');
      const { Appointment } = await import('../models/Appointment');
      
      const totalPatients = await User.countDocuments({ role: UserRole.PATIENT });
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayAppointments = await Appointment.countDocuments({
        date: { $gte: today, $lt: tomorrow }
      });
      
      const pendingAppointments = await Appointment.countDocuments({
        status: 'scheduled'
      });
      
      // Calcular ingresos del mes
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const appointments = await Appointment.find({
        status: 'completed',
        date: { $gte: startOfMonth }
      });
      
      const monthRevenue = appointments.reduce((sum, apt) => sum + (apt.amount || 0), 0);
      
      res.json({
        success: true,
        data: {
          totalPatients,
          todayAppointments,
          pendingAppointments,
          monthRevenue
        }
      });
    } catch (err) { 
      next(err); 
    }
  };
}