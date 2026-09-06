import React, { useState } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { validateAppointmentSlot, type AppointmentSlot } from '../utils/appointmentValidation';

interface QuickAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (appointmentData: any) => void;
}

export const QuickAppointmentModal: React.FC<QuickAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [patientName, setPatientName] = useState('');
  const [dentistId, setDentistId] = useState('dentist_main');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [treatmentType, setTreatmentType] = useState('Limpieza');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!patientName.trim()) {
      setError('Por favor ingrese el nombre del paciente');
      return;
    }

    if (!date) {
      setError('Por favor seleccione una fecha válida');
      return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const appointmentDateTime = new Date(`${date}T00:00:00`);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const slot: AppointmentSlot = {
      dentistId,
      dateTime: appointmentDateTime,
      durationMinutes,
      treatmentType,
    };

    // Aplicar validaciones de negocio clínicas
    const validation = validateAppointmentSlot(slot);
    if (!validation.isValid) {
      setError(validation.errorMessage || 'Horario no válido');
      return;
    }

    const appointmentPayload = {
      patientName,
      dentistId,
      dateTime: appointmentDateTime.toISOString(),
      durationMinutes,
      treatmentType,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
    };

    setSuccessMessage('¡Cita dental programada exitosamente!');
    if (onSuccess) onSuccess(appointmentPayload);

    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h3 className="font-medium text-lg">Agendamiento Rápido de Cita</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">
              Nombre del Paciente
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">
                Fecha
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">
                Hora
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">
                Tratamiento
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={treatmentType}
                  onChange={(e) => setTreatmentType(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 bg-white transition-colors"
                >
                  <option value="Limpieza">Limpieza Dental</option>
                  <option value="Ortodoncia">Ortodoncia</option>
                  <option value="Endodoncia">Endodoncia</option>
                  <option value="Extracción">Extracción</option>
                  <option value="Blanqueamiento">Blanqueamiento</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">
                Duración (Minutos)
              </label>
              <input
                type="number"
                min={15}
                step={15}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
            >
              Confirmar Agendamiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
