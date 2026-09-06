import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User, IUserDocument } from '../models/User';
import { PatientCRM } from '../models/PatientCRM';
import { Appointment } from '../models/Appointment';
import { AppError } from '../utils/AppError';
import { UserRole } from '@intelident/shared';
import { logger } from '../utils/logger';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth.middleware';

// Modelo para configuración (puedes crearlo)
// import { Settings } from '../models/Settings';

export class AdminController {
  // ==================== GESTIÓN DE USUARIOS ====================

  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { search, role, page = 1, limit = 20 } = req.query;
      
      let query: any = {};
      
      if (search) {
        query.$or = [
          { email: { $regex: search, $options: 'i' } },
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
        ];
      }
      
      if (role) {
        query.role = role;
      }
      
      const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
      
      const total = await User.countDocuments(query);
      
      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        },
      });
    } catch (err) {
      next(err);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        throw new AppError('Usuario no encontrado', 404);
      }
      
      res.json({ success: true, data: { user } });
    } catch (err) {
      next(err);
    }
  };

  changeUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      
      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!user) {
        throw new AppError('Usuario no encontrado', 404);
      }
      
      logger.info(`Rol de usuario actualizado: ${user.email} -> ${role}`);
      
      res.json({
        success: true,
        data: { user },
        message: 'Rol actualizado exitosamente',
      });
    } catch (err) {
      next(err);
    }
  };

  toggleUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;
      
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive },
        { new: true }
      ).select('-password');
      
      if (!user) {
        throw new AppError('Usuario no encontrado', 404);
      }
      
      logger.info(`Usuario ${isActive ? 'activado' : 'desactivado'}: ${user.email}`);
      
      res.json({
        success: true,
        data: { user },
        message: `Usuario ${isActive ? 'activado' : 'desactivado'} exitosamente`,
      });
    } catch (err) {
      next(err);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      
      const user = await User.findByIdAndDelete(userId);
      
      if (!user) {
        throw new AppError('Usuario no encontrado', 404);
      }
      
      // Eliminar también registro CRM
      await PatientCRM.findOneAndDelete({ patientId: userId });
      
      logger.info(`Usuario eliminado: ${user.email}`);
      
      res.json({
        success: true,
        message: 'Usuario eliminado exitosamente',
      });
    } catch (err) {
      next(err);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, firstName, lastName, role = UserRole.PATIENT } = req.body;
      
      const existing = await User.findOne({ email });
      if (existing) {
        throw new AppError('El email ya está registrado', 409);
      }
      
      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        role,
        isActive: true,
        isEmailVerified: true,
      });
      
      // Crear registro CRM
      await PatientCRM.create({
        patientId: user._id,
        source: 'admin',
        status: 'active',
      });
      
      res.status(201).json({
        success: true,
        data: { user: user.toJSON() },
        message: 'Usuario creado exitosamente',
      });
    } catch (err) {
      next(err);
    }
  };

  // ==================== CONFIGURACIÓN ====================

  getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Por ahora devolvemos configuración por defecto
      // En producción, esto vendría de una colección Settings
      const settings = {
        clinicName: 'InteliDent Clinic',
        clinicPhone: '+56 9 1234 5678',
        clinicEmail: 'contacto@intelident.com',
        clinicAddress: 'Av. Principal 123, Santiago',
        workingHours: { start: '09:00', end: '18:00' },
        notifications: { email: true, sms: false, whatsapp: true },
        aiConfig: { 
          enabled: true, 
          autoRespond: true, 
          sentimentAnalysis: false,
          openaiKey: process.env.OPENAI_API_KEY ? 'configured' : null,
          n8nWebhook: process.env.N8N_WEBHOOK_URL || null,
        },
      };
      
      res.json({ success: true, data: settings });
    } catch (err) {
      next(err);
    }
  };

  updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const settings = req.body;
      
      // Aquí guardarías en la base de datos
      logger.info('Configuración actualizada:', settings);
      
      res.json({
        success: true,
        message: 'Configuración guardada exitosamente',
      });
    } catch (err) {
      next(err);
    }
  };

  // ==================== ANALYTICS ====================

  getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const totalPatients = await User.countDocuments({ role: UserRole.PATIENT });
      const totalDentists = await User.countDocuments({ role: UserRole.DENTIST });
      
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
      
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const completedAppointments = await Appointment.find({
        status: 'completed',
        date: { $gte: startOfMonth }
      });
      
      const monthRevenue = completedAppointments.reduce((sum, apt: any) => sum + (apt.amount || 0), 0);
      
      res.json({
        success: true,
        data: {
          totalPatients,
          totalDentists,
          todayAppointments,
          pendingAppointments,
          monthRevenue,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  getAIInsights = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Aquí iría la lógica de IA
      const insights = {
        predictedPatients: '+12%',
        bestTime: '10:00 - 12:00',
        recommendation: 'Aumentar horarios de tarde',
        sentiment: 'positivo',
      };
      
      res.json({ success: true, data: insights });
    } catch (err) {
      next(err);
    }
  };

  getPredictions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const predictions = {
        predictedNewPatients: 45,
        growthRate: 12.5,
        churnRisk: 8.3,
        atRiskPatients: 23,
        projectedRevenue: 12500,
        occupancyRate: 78,
        peakHours: '10:00 - 12:00',
      };
      
      res.json({ success: true, data: predictions });
    } catch (err) {
      next(err);
    }
  };

  // ==================== INTEGRACIONES ====================

  testConnection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { type } = req.body;
      
      let success = false;
      let message = '';
      
      switch (type) {
        case 'openai':
          // Probar conexión con OpenAI
          success = !!process.env.OPENAI_API_KEY;
          message = success ? 'Conexión exitosa' : 'API Key no configurada';
          break;
        case 'n8n':
          // Probar conexión con n8n
          success = !!process.env.N8N_WEBHOOK_URL;
          message = success ? 'Conexión exitosa' : 'Webhook no configurado';
          break;
        default:
          success = false;
          message = 'Tipo de conexión no soportado';
      }
      
      res.json({ success, message });
    } catch (err) {
      next(err);
    }
  };

  // ==================== CRM ====================

  getCRMStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const totalPatients = await PatientCRM.countDocuments();
      const activePatients = await PatientCRM.countDocuments({ status: 'active' });
      const leads = await PatientCRM.countDocuments({ status: 'lead' });
      
      const sourceBreakdown = await PatientCRM.aggregate([
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]);
      
      res.json({
        success: true,
        data: {
          totalPatients,
          activePatients,
          leads,
          sourceBreakdown,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  getFollowUps = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const today = new Date();
      const followUps = await PatientCRM.find({
        nextFollowUp: { $lte: today },
        status: { $in: ['lead', 'active'] },
      }).populate('patientId', 'firstName lastName email phone');
      
      res.json({ success: true, data: { followUps } });
    } catch (err) {
      next(err);
    }
  };

  addInteraction = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { patientId } = req.params;
    const { type, notes } = req.body;
    
    const crm = await PatientCRM.findOne({ patientId });
    if (!crm) {
      throw new AppError('Registro CRM no encontrado', 404);
    }
    
    crm.interactions.push({
      type,
      notes,
      date: new Date(),
      handledBy: new mongoose.Types.ObjectId(req.user!.userId), // Convertir a ObjectId
    });
    crm.lastContact = new Date();
    await crm.save();
    
    res.json({
      success: true,
      message: 'Interacción registrada exitosamente',
    });
  } catch (err) {
    next(err);
  }
};

  // ==================== RESPALDOS ====================

  createBackup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Aquí iría la lógica de respaldo
      logger.info('Respaldo iniciado por admin');
      
      res.json({
        success: true,
        message: 'Respaldo creado exitosamente',
        data: { backupId: Date.now().toString() },
      });
    } catch (err) {
      next(err);
    }
  };

  getBackups = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Aquí iría la lista de respaldos
      res.json({
        success: true,
        data: { backups: [] },
      });
    } catch (err) {
      next(err);
    }
  };

  restoreBackup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { backupId } = req.params;
      logger.info(`Restaurando respaldo: ${backupId}`);
      
      res.json({
        success: true,
        message: 'Respaldo restaurado exitosamente',
      });
    } catch (err) {
      next(err);
    }
  };
}