import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();
const controller = new AuthController();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  { success: false, message: 'Demasiados intentos. Intente en 15 minutos' },
});

const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      3,
  message:  { success: false, message: 'Demasiadas solicitudes de recuperación' },
});

// ─── Validaciones ─────────────────────────────────────────────────
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .optional(),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('Nombre requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('Nombre debe tener entre 2 y 50 caracteres'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Apellido requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('Apellido debe tener entre 2 y 50 caracteres'),
  body('phone')
    .optional()
    .trim(),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Contraseña requerida'),
];

// ─── Endpoints ────────────────────────────────────────────────────
router.post('/register', registerValidation, validate, controller.register);
router.post('/login',    loginLimiter, loginValidation, validate, controller.login);
router.post('/logout',   authenticate, controller.logout);
router.post('/refresh',  controller.refreshToken);

router.post(
  '/forgot-password',
  forgotLimiter,
  [body('email').isEmail().normalizeEmail()],
  validate,
  controller.forgotPassword,
);

router.post(
  '/reset-password/:token',
  [
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  validate,
  controller.resetPassword,
);

router.get('/me', authenticate, controller.getMe);
router.get('/dashboard/stats', authenticate, controller.getDashboardStats);


export { router as authRouter };