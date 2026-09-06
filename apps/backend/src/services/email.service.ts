import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT ?? '587'),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  private async send(
    to:      string,
    subject: string,
    html:    string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from:    `InteliDent <${process.env.SMTP_FROM}>`,
        to, subject, html,
      });
    } catch (error) {
      logger.error('Error enviando email:', error);
      // No lanzar — los emails no deben bloquear el flujo
    }
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.send(
      to,
      '¡Bienvenido a InteliDent!',
      `<h2>Hola ${name}</h2>
       <p>Tu cuenta ha sido creada exitosamente en InteliDent Management Solutions.</p>
       <p>Puedes iniciar sesión en: <a href="${process.env.FRONTEND_URL}/login">Ingresar</a></p>`,
    );
  }

  async sendPasswordResetEmail(
    to: string, name: string, resetUrl: string,
  ): Promise<void> {
    await this.send(
      to,
      'Recuperación de contraseña — InteliDent',
      `<h2>Hola ${name}</h2>
       <p>Recibimos una solicitud para restablecer tu contraseña.</p>
       <p><a href="${resetUrl}" style="background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">
         Restablecer contraseña
       </a></p>
       <p>Este enlace expira en <strong>1 hora</strong>.</p>
       <p>Si no solicitaste esto, ignora este correo.</p>`,
    );
  }
}

export const emailService = new EmailService();