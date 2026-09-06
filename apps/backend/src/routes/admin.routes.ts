import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { AdminController } from '../controllers/admin.controller';

const router = Router();
const adminController = new AdminController();

// Todas las rutas requieren autenticación y rol de administrador
router.use(authenticate, requireAdmin);

// ==================== GESTIÓN DE USUARIOS ====================

// Obtener todos los usuarios
router.get('/users', adminController.getAllUsers);

// Obtener un usuario específico
router.get('/users/:userId', adminController.getUserById);

// Cambiar rol de usuario
router.put(
  '/users/:userId/role',
  [
    body('role')
      .isIn(['admin', 'dentist', 'receptionist', 'patient'])
      .withMessage('Rol inválido'),
  ],
  validate,
  adminController.changeUserRole
);

// Activar/desactivar usuario
router.put(
  '/users/:userId/status',
  [
    body('isActive')
      .isBoolean()
      .withMessage('isActive debe ser booleano'),
  ],
  validate,
  adminController.toggleUserStatus
);

// Eliminar usuario
router.delete('/users/:userId', adminController.deleteUser);

// Crear usuario (admin)
router.post(
  '/users',
  [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres'),
    body('firstName').notEmpty().withMessage('Nombre requerido'),
    body('lastName').notEmpty().withMessage('Apellido requerido'),
    body('role').optional().isIn(['admin', 'dentist', 'receptionist', 'patient']),
  ],
  validate,
  adminController.createUser
);

// ==================== CONFIGURACIÓN ====================

// Obtener configuración
router.get('/settings', adminController.getSettings);

// Actualizar configuración
router.post(
  '/settings',
  [
    body('clinicName').optional().isString(),
    body('clinicPhone').optional().isString(),
    body('clinicEmail').optional().isEmail(),
    body('clinicAddress').optional().isString(),
    body('workingHours').optional().isObject(),
    body('notifications').optional().isObject(),
    body('aiConfig').optional().isObject(),
  ],
  validate,
  adminController.updateSettings
);

// ==================== ANALYTICS Y DASHBOARD ====================

// Estadísticas del dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

// Insights de IA
router.get('/analytics/ai-insights', adminController.getAIInsights);

// Predicciones
router.get('/analytics/predictions', adminController.getPredictions);

// ==================== INTEGRACIONES ====================

// Probar conexión con servicios externos
router.post(
  '/test-connection',
  [
    body('type')
      .isIn(['openai', 'n8n', 'whatsapp', 'email'])
      .withMessage('Tipo de conexión inválido'),
  ],
  validate,
  adminController.testConnection
);

// ==================== CRM ====================

// Obtener estadísticas de CRM
router.get('/crm/stats', adminController.getCRMStats);

// Obtener pacientes que necesitan seguimiento
router.get('/crm/follow-ups', adminController.getFollowUps);

// Agregar interacción a paciente
router.post(
  '/crm/interactions/:patientId',
  [
    body('type').isIn(['call', 'email', 'whatsapp', 'sms', 'visit']),
    body('notes').optional().isString(),
  ],
  validate,
  adminController.addInteraction
);

// ==================== RESPALDOS ====================

// Respaldar base de datos
router.post('/backup', adminController.createBackup);

// Obtener lista de respaldos
router.get('/backups', adminController.getBackups);

// Restaurar respaldo
router.post('/backups/restore/:backupId', adminController.restoreBackup);

export { router as adminRouter };