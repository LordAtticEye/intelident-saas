import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { User, IUserDocument } from '../models/User';
import { Session } from '../models/Session';
import { getRedisClient } from '../config/redis';
import { emailService } from './email.service';
import { AppError } from '../utils/AppError';
import { JwtPayload, UserRole } from '@intelident/shared';
import { logger } from '../utils/logger';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutos

// Validar y tipar las variables de entorno
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '15m') as SignOptions['expiresIn'];
const JWT_REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}
if (!JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
}

class AuthService {
  // ─── Generar tokens ───────────────────────────────────────────────
  generateAccessToken(payload: Omit<JwtPayload, never>): string {
    const options: SignOptions = {
      expiresIn: JWT_EXPIRES_IN,
    };
    return jwt.sign(payload, JWT_SECRET, options);
  }

  generateRefreshToken(payload: Omit<JwtPayload, never>): string {
    const options: SignOptions = {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    };
    return jwt.sign(payload, JWT_REFRESH_SECRET, options);
  }

  // ─── Registro ─────────────────────────────────────────────────────
  async register(data: {
    email:     string;
    password:  string;
    firstName: string;
    lastName:  string;
    phone?:    string;  // ← Agregar phone
    role?:     UserRole;
  }): Promise<{ user: IUserDocument; accessToken: string; refreshToken: string }> {
    console.log('📝 [AuthService] Iniciando registro:', { email: data.email, firstName: data.firstName });
    
    // Verificar si el usuario ya existe
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      console.log('❌ [AuthService] Email ya registrado:', data.email);
      throw new AppError('El email ya está registrado', 409);
    }

    // Crear usuario
    console.log('👤 [AuthService] Creando usuario...');
    const user = await User.create({
      email:     data.email,
      password:  data.password,
      firstName: data.firstName,
      lastName:  data.lastName,
      phone:     data.phone,
      role:      data.role ?? UserRole.PATIENT,
    });
    console.log('✅ [AuthService] Usuario creado con ID:', user._id);

    // Crear sesión
    console.log('🔐 [AuthService] Creando sesión...');
    const { accessToken, refreshToken } = await this.createSession(user, '', '');
    console.log('✅ [AuthService] Sesión creada');

    // Enviar email de bienvenida (opcional - no debe bloquear el registro)
    console.log('📧 [AuthService] Enviando email de bienvenida...');
    try {
      await emailService.sendWelcomeEmail(user.email, user.firstName);
      console.log('✅ [AuthService] Email enviado correctamente');
    } catch (emailError) {
      // Solo loguear el error, no bloquear el registro
      console.warn('⚠️ [AuthService] Error al enviar email de bienvenida:', emailError);
      logger.warn('Error al enviar email de bienvenida:', emailError);
    }

    console.log('🎉 [AuthService] Registro completado exitosamente');
    return { user, accessToken, refreshToken };
  }

  // ─── Login ────────────────────────────────────────────────────────
  async login(
    email:     string,
    password:  string,
    userAgent: string,
    ipAddress: string,
  ): Promise<{ user: IUserDocument; accessToken: string; refreshToken: string }> {
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new AppError('Credenciales incorrectas', 401);

    if (!user.isActive) throw new AppError('Cuenta desactivada', 403);

    if (user.isLocked()) {
      const minutesLeft = Math.ceil(
        ((user.lockUntil?.getTime() ?? 0) - Date.now()) / 60000,
      );
      throw new AppError(
        `Cuenta bloqueada. Intente en ${minutesLeft} minutos`,
        429,
      );
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      await this.handleFailedLogin(user);
      throw new AppError('Credenciales incorrectas', 401);
    }

    // Restablecer intentos fallidos
    await User.findByIdAndUpdate(user._id, {
      loginAttempts: 0,
      lockUntil:     undefined,
      lastLogin:     new Date(),
    });

    const { accessToken, refreshToken } = await this.createSession(
      user, userAgent, ipAddress,
    );
    return { user, accessToken, refreshToken };
  }

  // ─── Crear sesión ─────────────────────────────────────────────────
  private async createSession(
    user:      IUserDocument,
    userAgent: string,
    ipAddress: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const sessionId    = uuidv4();
    const MAX_SESSIONS = parseInt(process.env.MAX_SESSIONS_PER_USER ?? '3');

    const payload: JwtPayload = {
      userId:    user._id.toString(),
      email:     user.email,
      role:      user.role,
      sessionId,
    };

    const accessToken  = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    const expiresAt    = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Guardar sesión en MongoDB
    await Session.create({
      userId: user._id, sessionId, refreshToken, userAgent, ipAddress, expiresAt,
    });

    // Guardar en Redis (con try-catch para no fallar)
    try {
      const redis = getRedisClient();
      await redis.setEx(
        `session:${sessionId}`,
        7 * 24 * 60 * 60,
        JSON.stringify(payload),
      );

      // Control de sesiones concurrentes
      const sessionListKey = `user_sessions:${user._id}`;
      await redis.lPush(sessionListKey, sessionId);
      await redis.lTrim(sessionListKey, 0, MAX_SESSIONS - 1);
      await redis.expire(sessionListKey, 7 * 24 * 60 * 60);
    } catch (redisError) {
      console.warn('⚠️ Error de Redis (no crítico):', redisError);
      logger.warn('Error de Redis al crear sesión:', redisError);
      // No lanzar error - Redis es opcional
    }

    return { accessToken, refreshToken };
  }

  // ─── Logout ───────────────────────────────────────────────────────
  async logout(accessToken: string, payload: JwtPayload): Promise<void> {
    try {
      const redis = getRedisClient();
      const remainingTTL = 15 * 60; // 15 min = vida del access token

      // Agregar token a lista negra
      await redis.setEx(`blacklist:${accessToken}`, remainingTTL, '1');

      // Eliminar sesión de Redis
      await redis.del(`session:${payload.sessionId}`);
      await redis.lRem(`user_sessions:${payload.userId}`, 1, payload.sessionId);
    } catch (redisError) {
      console.warn('⚠️ Error de Redis en logout:', redisError);
    }

    // Marcar sesión como inactiva en MongoDB
    await Session.findOneAndUpdate(
      { sessionId: payload.sessionId },
      { isActive: false },
    );
  }

  // ─── Refresh token ────────────────────────────────────────────────
  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayload;

      const session = await Session.findOne({
        sessionId: decoded.sessionId,
        isActive:  true,
      });
      if (!session) throw new AppError('Sesión inválida', 401);

      const newPayload: JwtPayload = {
        userId:    decoded.userId,
        email:     decoded.email,
        role:      decoded.role,
        sessionId: decoded.sessionId,
      };

      const accessToken = this.generateAccessToken(newPayload);

      // Actualizar en Redis
      try {
        const redis = getRedisClient();
        await redis.setEx(
          `session:${decoded.sessionId}`,
          7 * 24 * 60 * 60,
          JSON.stringify(newPayload),
        );
      } catch (redisError) {
        console.warn('⚠️ Error de Redis en refresh:', redisError);
      }

      return { accessToken };
    } catch {
      throw new AppError('Refresh token inválido o expirado', 401);
    }
  }

  // ─── Recuperación de contraseña ───────────────────────────────────
  async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email });
    // Siempre responder OK para no revelar si el email existe
    if (!user) return;

    const resetToken  = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await User.findByIdAndUpdate(user._id, {
      passwordResetToken:   hashedToken,
      passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    try {
      await emailService.sendPasswordResetEmail(user.email, user.firstName, resetUrl);
    } catch (emailError) {
      console.warn('⚠️ Error al enviar email de recuperación:', emailError);
      logger.warn('Error al enviar email de recuperación:', emailError);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken:   hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select('+password');

    if (!user) throw new AppError('Token inválido o expirado', 400);

    user.password             = newPassword;
    user.passwordResetToken   = undefined;
    user.passwordResetExpires = undefined;
    user.loginAttempts        = 0;
    user.lockUntil            = undefined;
    await user.save();

    // Invalidar todas las sesiones activas
    try {
      const redis = getRedisClient();
      const sessions = await redis.lRange(`user_sessions:${user._id}`, 0, -1);
      for (const sid of sessions) {
        await redis.del(`session:${sid}`);
      }
      await redis.del(`user_sessions:${user._id}`);
    } catch (redisError) {
      console.warn('⚠️ Error de Redis en resetPassword:', redisError);
    }
    
    await Session.updateMany({ userId: user._id }, { isActive: false });
  }

  // ─── Manejo de intentos fallidos ──────────────────────────────────
  private async handleFailedLogin(user: IUserDocument): Promise<void> {
    const attempts = (user.loginAttempts ?? 0) + 1;
    const update: any = { loginAttempts: attempts };

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      update.lockUntil  = new Date(Date.now() + LOCK_TIME_MS);
      update.loginAttempts = 0;
      logger.warn(`Cuenta bloqueada por intentos fallidos: ${user.email}`);
    }

    await User.findByIdAndUpdate(user._id, update);
  }

  async createAdmin(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<IUserDocument> {
  console.log('👑 Creando administrador...');
  
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new AppError('El email ya está registrado', 409);
  }

  const user = await User.create({
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    role: UserRole.ADMIN,
    isActive: true,
    isEmailVerified: true,
  });

  console.log('✅ Administrador creado:', user.email);
  return user;
}
}


export const authService = new AuthService();