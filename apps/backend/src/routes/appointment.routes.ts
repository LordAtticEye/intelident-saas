import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { AppointmentController } from '../controllers/appointment.controller';
import { authenticate, authorize, checkPermission } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { UserRole } from '@intelident/shared';

const router = Router();
const controller = new AppointmentController();

router.use(authenticate);

router.get(
  '/',
  authorize(UserRole.ADMIN, UserRole.DENTIST, UserRole.RECEPTIONIST),
  [
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601(),
    query('dentistId').optional().isMongoId(),
  ],
  validate,
  controller.getAll,
);

router.post(
  '/',
  checkPermission('appointments', 'create'),
  [
    body('patientId').isMongoId().withMessage('ID de paciente inválido'),
    body('dentistId').isMongoId().withMessage('ID de dentista inválido'),
    body('date').isISO8601().withMessage('Fecha inválida'),
    body('duration').optional().isInt({ min: 15, max: 240 }),
    body('treatment').optional().trim(),
  ],
  validate,
  controller.create,
);

router.put(
  '/:id/status',
  authorize(UserRole.ADMIN, UserRole.DENTIST, UserRole.RECEPTIONIST),
  [
    param('id').isMongoId(),
    body('status').isIn(['CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
  ],
  validate,
  controller.updateStatus,
);

router.delete(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.RECEPTIONIST),
  [param('id').isMongoId()],
  validate,
  controller.delete,
);

export { router as appointmentRouter };