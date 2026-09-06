import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserPlus, Search, Edit2, Trash2, ArrowRight, ChevronRight } from 'lucide-react';
import api from '../../api/axiosClient';

export const PatientsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients', searchTerm],
    queryFn: () => api.get('/patients', { params: { search: searchTerm } }).then(r => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const patientList = patients?.patients || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl font-light text-gray-900 tracking-tight">
            Pacientes
          </h1>
          <p className="text-gray-400 text-sm mt-1 font-mono">
            Gestión de pacientes registrados
          </p>
        </div>
        <button className="group flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-mono tracking-wide transition-all duration-200">
          <UserPlus className="w-4 h-4" />
          Nuevo paciente
          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Search */}
      <div className="border-b border-gray-100 pb-6">
        <div className="relative">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Buscar paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-6 py-2 border-b border-gray-200 text-gray-900 text-sm 
              focus:outline-none focus:border-gray-900 transition-colors bg-transparent
              font-mono placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center">
        <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
          {patientList.length} paciente{patientList.length !== 1 ? 's' : ''} registrado{patientList.length !== 1 ? 's' : ''}
        </p>
        <button className="text-xs font-mono text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1">
          Exportar lista
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Patient List */}
      {patientList.length === 0 ? (
        <div className="border border-gray-100 bg-white p-12 text-center">
          <Search className="w-10 h-10 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-sm font-mono">
            No se encontraron pacientes
          </p>
          <p className="text-gray-300 text-xs font-mono mt-1">
            Intenta con otro término de búsqueda
          </p>
        </div>
      ) : (
        <div className="border border-gray-100 bg-white overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50">
            <div className="col-span-4">
              <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                Nombre
              </p>
            </div>
            <div className="col-span-3">
              <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                Email
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                Teléfono
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                Última visita
              </p>
            </div>
            <div className="col-span-1 text-right">
              <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                Acciones
              </p>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {patientList.map((patient: any) => (
              <div 
                key={patient._id} 
                className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="col-span-4">
                  <p className="text-sm text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-gray-500 font-mono">
                    {patient.email}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 font-mono">
                    {patient.phone || '—'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 font-mono">
                    {patient.lastVisit 
                      ? new Date(patient.lastVisit).toLocaleDateString('es-ES')
                      : '—'
                    }
                  </p>
                </div>
                <div className="col-span-1 flex justify-end gap-3">
                  <button 
                    className="text-gray-400 hover:text-gray-700 transition-colors"
                    title="Editar paciente"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Eliminar paciente"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination (placeholder) */}
      {patientList.length > 0 && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <p className="text-xs font-mono text-gray-400">
            Mostrando 1-{Math.min(10, patientList.length)} de {patientList.length} pacientes
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs font-mono text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50" disabled>
              Anterior
            </button>
            <button className="px-3 py-1 text-xs font-mono text-gray-900 bg-gray-100">
              1
            </button>
            <button className="px-3 py-1 text-xs font-mono text-gray-400 hover:text-gray-900 transition-colors">
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};