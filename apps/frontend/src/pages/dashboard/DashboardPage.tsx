import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { Users, Calendar, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '@intelident/shared';
import api from '../../api/axiosClient';

const CHART_COLORS = ['#1a1a1a', '#404040', '#666666', '#8c8c8c'];

const MetricCard: React.FC<{
  title: string; 
  value: string | number; 
  icon: React.ReactNode;
}> = ({ title, value, icon }) => (
  <div className="border border-gray-100 bg-white p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
        {title}
      </span>
      <div className="text-gray-300">
        {icon}
      </div>
    </div>
    <p className="text-2xl font-light text-gray-900 tracking-tight">
      {value}
    </p>
  </div>
);

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/dashboard/stats').then((r) => r.data.data),
  });

  // Mock data para visualización
  const appointmentsData = [
    { month: 'ENE', total: 45 }, { month: 'FEB', total: 52 },
    { month: 'MAR', total: 61 }, { month: 'ABR', total: 58 },
    { month: 'MAY', total: 71 }, { month: 'JUN', total: 68 },
    { month: 'JUL', total: 74 }, { month: 'AGO', total: 82 },
  ];

  const treatmentData = [
    { name: 'Limpieza', value: 35 },
    { name: 'Extracción', value: 20 },
    { name: 'Ortodoncia', value: 25 },
    { name: 'Endodoncia', value: 20 },
  ];

  const isAdmin = user?.role === UserRole.ADMIN;
  const isDentist = user?.role === UserRole.DENTIST;
  const showCharts = isAdmin || isDentist;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-light text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-400 text-sm mt-1 font-mono">
          Bienvenido, {user?.firstName}. Resumen del día
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
        <MetricCard
          title="PACIENTES TOTALES"
          value={stats?.totalPatients?.toLocaleString() ?? '—'}
          icon={<Users className="w-4 h-4" />}
        />
        <MetricCard
          title="CITAS HOY"
          value={stats?.todayAppointments ?? '—'}
          icon={<Calendar className="w-4 h-4" />}
        />
        <MetricCard
          title="INGRESOS DEL MES"
          value={stats?.monthRevenue ? `$${stats.monthRevenue.toLocaleString()}` : '—'}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          title="PENDIENTES"
          value={stats?.pendingAppointments ?? '—'}
          icon={<AlertCircle className="w-4 h-4" />}
        />
      </div>

      {/* Charts Section */}
      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="border border-gray-100 bg-white p-5">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-xs font-mono text-gray-900 uppercase tracking-wider">
                  Citas por mes
                </h3>
                <p className="text-xs font-mono text-gray-400 mt-1">
                  Últimos 8 meses
                </p>
              </div>
              <button className="text-xs font-mono text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1">
                Ver detalles
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={appointmentsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    fontSize: '10px', 
                    fontFamily: 'monospace',
                    border: '1px solid #e5e5e5',
                    borderRadius: '0',
                    boxShadow: 'none'
                  }}
                />
                <Bar 
                  dataKey="total" 
                  fill="#1a1a1a" 
                  radius={[0, 0, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="border border-gray-100 bg-white p-5">
            <div className="mb-5">
              <h3 className="text-xs font-mono text-gray-900 uppercase tracking-wider">
                Tratamientos más frecuentes
              </h3>
              <p className="text-xs font-mono text-gray-400 mt-1">
                Distribución por tipo
              </p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={treatmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent = 0 }) => 
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={{ stroke: '#d4d4d4', strokeWidth: 0.5 }}
                >
                  {treatmentData.map((_, i) => (
                    <Cell 
                      key={i} 
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    fontSize: '10px', 
                    fontFamily: 'monospace',
                    border: '1px solid #e5e5e5',
                    borderRadius: '0',
                    boxShadow: 'none'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Activity Section - Optional */}
      {showCharts && (
        <div className="border border-gray-100 bg-white">
          <div className="border-b border-gray-100 px-5 py-4">
            <h3 className="text-xs font-mono text-gray-900 uppercase tracking-wider">
              Actividad reciente
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  <span className="text-xs font-mono text-gray-500">
                    Nueva cita programada - Paciente ID #{Math.floor(Math.random() * 10000)}
                  </span>
                </div>
                <span className="text-xs font-mono text-gray-400">
                  hace {i === 0 ? '5' : i === 1 ? '15' : '30'} minutos
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};