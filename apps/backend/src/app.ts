import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { authRouter }        from './routes/auth.routes';
import { patientRouter }     from './routes/patient.routes';
import { appointmentRouter } from './routes/appointment.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';
import { chatbotRouter } from './routes/chatbot.routes';

const app = express();

// ─── Seguridad ─────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", 'data:', 'https:'],
    },
  },
}));

app.use(cors({
  origin: [
    process.env.FRONTEND_URL ?? 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ],
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      200,
  message:  { success: false, message: 'Demasiadas solicitudes' },
  standardHeaders: true,
  legacyHeaders:   false,
}));

// ─── Parsers ───────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Logging ───────────────────────────────────────────────────────
app.use(morgan('combined', {
  stream: { write: (msg) => logger.http(msg.trim()) },
}));

// ─── Ruta raíz informativa ─────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    name:        'InteliDent API Backend',
    version:     '1.0.0',
    status:      'online',
    frontendUrl: 'http://localhost:5173',
    endpoints: {
      health:       '/health',
      auth:         '/api/v1/auth',
      patients:     '/api/v1/patients',
      appointments: '/api/v1/appointments',
      chatbot:      '/api/v1/chatbot',
    },
  });
});

// ─── Health check ──────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    env:       process.env.NODE_ENV,
  });
});

// ─── Rutas API ─────────────────────────────────────────────────────
app.use('/api/v1/auth',         authRouter);
app.use('/api/v1/patients',     patientRouter);
app.use('/api/v1/appointments', appointmentRouter);
app.use('/api/v1/chatbot', chatbotRouter);

// ─── Errores ───────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;