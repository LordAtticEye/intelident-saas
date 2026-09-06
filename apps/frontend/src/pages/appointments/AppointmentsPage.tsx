import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarPlus, Calendar, Clock, User, Stethoscope, ArrowRight } from 'lucide-react';
import api from '../../api/axiosClient';

export const AppointmentsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', selectedDate],
    queryFn: () => api.get('/appointments', { params: { date: selectedDate } }).then(r => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const appointmentList = appointments?.appointments || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl font-light text-gray-900 tracking-tight">
            Citas
          </h1>
          <p className="text-gray-400 text-sm mt-1 font-mono">
            Gestión de citas médicas
          </p>
        </div>
        <button className="group flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-mono tracking-wide transition-all duration-200">
          <CalendarPlus className="w-4 h-4" />
          Nueva cita
          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Date Picker */}
      <div className="border-b border-gray-100 pb-6">
        <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-3">
          Seleccionar fecha
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-0 py-2 border-b border-gray-200 text-gray-900 text-sm 
            focus:outline-none focus:border-gray-900 transition-colors bg-transparent
            font-mono"
        />
      </div>

      {/* Appointments List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
            {appointmentList.length} cita{appointmentList.length !== 1 ? 's' : ''} programada{appointmentList.length !== 1 ? 's' : ''}
          </p>
        </div>

        {appointmentList.length === 0 ? (
          <div className="border border-gray-100 bg-white p-12 text-center">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-sm font-mono">
              No hay citas programadas para esta fecha
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {appointmentList.map((appointment: any) => (
              <div 
                key={appointment._id} 
                className="border border-gray-100 bg-white hover:border-gray-200 transition-colors"
              >
                <div className="p-4 flex items-start justify-between">
                  <div className="space-y-2">
                    {/* Time */}
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-300" />
                      <span className="text-xs font-mono text-gray-600">
                        {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    {/* Patient */}
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-gray-300" />
                      <span className="text-sm text-gray-700">
                        {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                      </span>
                      <span className="text-xs font-mono text-gray-400 ml-1">
                        PACIENTE
                      </span>
                    </div>
                    
                    {/* Dentist */}
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-3.5 h-3.5 text-gray-300" />
                      <span className="text-sm text-gray-700">
                        {appointment.dentistId?.firstName} {appointment.dentistId?.lastName}
                      </span>
                      <span className="text-xs font-mono text-gray-400 ml-1">
                        DENTISTA
                      </span>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div>
                    <span className={`text-xs font-mono uppercase tracking-wider px-2 py-1 ${
                      appointment.status === 'scheduled' ? 'text-yellow-600 bg-yellow-50' :
                      appointment.status === 'confirmed' ? 'text-green-600 bg-green-50' :
                      appointment.status === 'completed' ? 'text-blue-600 bg-blue-50' :
                      'text-gray-500 bg-gray-50'
                    }`}>
                      {appointment.status === 'scheduled' ? 'Programada' :
                       appointment.status === 'confirmed' ? 'Confirmada' :
                       appointment.status === 'completed' ? 'Completada' :
                       appointment.status === 'cancelled' ? 'Cancelada' : appointment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};