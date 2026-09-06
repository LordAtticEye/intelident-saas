import { describe, it, expect } from 'vitest';
import { validateAppointmentSlot, type AppointmentSlot } from '../appointmentValidation';

describe('TDD Suite: Validación de Citas Dentales (InteliDent)', () => {
  it('Falla (RED): Rechaza citas agendadas en fechas u horarios pasados', () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24); // Ayer
    const slot: AppointmentSlot = {
      dentistId: 'dentist_123',
      dateTime: pastDate,
      durationMinutes: 30,
      treatmentType: 'Limpieza',
    };

    const result = validateAppointmentSlot(slot);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain('pasados');
  });

  it('Falla (RED): Rechaza citas programadas en domingo (clínica cerrada)', () => {
    const nextSunday = new Date();
    nextSunday.setDate(nextSunday.getDate() + ((7 - nextSunday.getDay()) % 7 || 7));
    nextSunday.setHours(11, 0, 0, 0);

    const slot: AppointmentSlot = {
      dentistId: 'dentist_123',
      dateTime: nextSunday,
      durationMinutes: 45,
      treatmentType: 'Endodoncia',
    };

    const result = validateAppointmentSlot(slot);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain('domingos');
  });

  it('Pasa (GREEN): Acepta citas válidas de Lunes a Viernes en horario laboral (9:00 - 18:00)', () => {
    const futureDate = new Date();
    // Próximo martes a las 10:00 AM
    futureDate.setDate(futureDate.getDate() + ((2 + 7 - futureDate.getDay()) % 7 || 7));
    futureDate.setHours(10, 0, 0, 0);

    const slot: AppointmentSlot = {
      dentistId: 'dentist_123',
      dateTime: futureDate,
      durationMinutes: 30,
      treatmentType: 'Ortodoncia',
    };

    const result = validateAppointmentSlot(slot);
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeUndefined();
  });
});
