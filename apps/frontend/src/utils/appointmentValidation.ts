export interface AppointmentSlot {
  dentistId: string;
  dateTime: Date;
  durationMinutes: number;
  treatmentType: string;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Validador de disponibilidad y reglas de negocio para agendamiento odontológico (TDD Demonstration)
 */
export const validateAppointmentSlot = (slot: AppointmentSlot): ValidationResult => {
  const now = new Date();

  // 1. No se pueden agendar citas en el pasado
  if (slot.dateTime < now) {
    return {
      isValid: false,
      errorMessage: 'No es posible agendar citas en fechas u horarios pasados',
    };
  }

  // 2. Horario de atención clínica: Lunes a Viernes 9:00 - 18:00, Sábados 9:00 - 13:00, Domingo cerrado (0)
  const day = slot.dateTime.getDay();
  const hours = slot.dateTime.getHours();

  if (day === 0) {
    return {
      isValid: false,
      errorMessage: 'La clínica no opera los domingos',
    };
  }

  if (day === 6 && (hours < 9 || hours >= 13)) {
    return {
      isValid: false,
      errorMessage: 'El horario de atención en sábado es de 9:00 a 13:00 hrs',
    };
  }

  if (day >= 1 && day <= 5 && (hours < 9 || hours >= 18)) {
    return {
      isValid: false,
      errorMessage: 'El horario de atención de lunes a viernes es de 9:00 a 18:00 hrs',
    };
  }

  // 3. Duración mínima de 15 minutos
  if (slot.durationMinutes < 15) {
    return {
      isValid: false,
      errorMessage: 'La duración mínima de consulta es de 15 minutos',
    };
  }

  return { isValid: true };
};
