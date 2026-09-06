import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { PatientController } from '../controllers/patient.controller';
import { authenticate, authorize, checkPermission } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { UserRole } from '@intelident/shared';

const router = Router();
const controller = new PatientController();

router.use(authenticate);

router.get(
  '/',
  authorize(UserRole.ADMIN, UserRole.DENTIST, UserRole.RECEPTIONIST),
  checkPermission('patients', 'read'),
  controller.getAll,
);

router.get(
  '/search',
  authorize(UserRole.ADMIN, UserRole.DENTIST, UserRole.RECEPTIONIST),
  [query('q').notEmpty().withMessage('Término de búsqueda requerido')],
  validate,
  controller.search,
);

router.get(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.DENTIST, UserRole.RECEPTIONIST),
  [param('id').isMongoId().withMessage('ID inválido')],
  validate,
  controller.getById,
);

router.post(
  '/',
  authorize(UserRole.ADMIN, UserRole.DENTIST, UserRole.RECEPTIONIST),
  checkPermission('patients', 'create'),
  [
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('dateOfBirth').isISO8601().withMessage('Fecha inválida'),
    body('phone').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('gender').isIn(['M', 'F', 'OTHER']),
  ],
  validate,
  controller.create,
);

router.put(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.DENTIST, UserRole.RECEPTIONIST),
  checkPermission('patients', 'update'),
  [param('id').isMongoId()],
  validate,
  controller.update,
);

router.post(
  '/:id/dental-notes',
  authorize(UserRole.ADMIN, UserRole.DENTIST),
  [
    param('id').isMongoId(),
    body('note').trim().notEmpty().withMessage('Nota requerida'),
    body('treatment').trim().notEmpty().withMessage('Tratamiento requerido'),
  ],
  validate,
  controller.addDentalNote,
);

router.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  [param('id').isMongoId()],
  validate,
  controller.delete,
);

export { router as patientRouter };