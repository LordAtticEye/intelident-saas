import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Brain, Activity } from 'lucide-react';
import api from '../../api/axiosClient';

export const AIAnalytics: React.FC = () => {
  const { data: analytics } = useQuery({
    queryKey: ['ai-analytics'],
    queryFn: () => api.get('/analytics/ai-insights').then(r => r.data.data),
  });

  const { data: predictions } = useQuery({
    queryKey: ['predictions'],
    queryFn: () => api.get('/analytics/predictions').then(r => r.data.data),
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-gray-900" />
          <h1 className="text-2xl font-light text-gray-900 tracking-tight">
            Análisis IA
          </h1>
        </div>
        <p className="text-gray-400 text-sm mt-1 font-mono">
          Insights y predicciones basadas en inteligencia artificial
        </p>
      </div>

      {/* Métricas IA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-gray-100">
        <div className="bg-white p-5">
          <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
            Pacientes predictivos
          </p>
          <p className="text-2xl font-light text-gray-900 mt-2">
            {predictions?.predictedNewPatients || '—'}
          </p>
          <p className="text-xs font-mono text-green-600 mt-1">
            +{predictions?.growthRate || 0}% vs mes anterior
          </p>
        </div>
        <div className="bg-white p-5">
          <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
            Riesgo de abandono
          </p>
          <p className="text-2xl font-light text-gray-900 mt-2">
            {predictions?.churnRisk || '—'}%
          </p>
          <p className="text-xs font-mono text-gray-500 mt-1">
            {predictions?.atRiskPatients || 0} pacientes en riesgo
          </p>
        </div>
        <div className="bg-white p-5">
          <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
            Ingresos proyectados
          </p>
          <p className="text-2xl font-light text-gray-900 mt-2">
            ${predictions?.projectedRevenue?.toLocaleString() || '—'}
          </p>
          <p className="text-xs font-mono text-green-600 mt-1">
            Próximo mes
          </p>
        </div>
        <div className="bg-white p-5">
          <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
            Tasa de ocupación
          </p>
          <p className="text-2xl font-light text-gray-900 mt-2">
            {predictions?.occupancyRate || '—'}%
          </p>
          <p className="text-xs font-mono text-gray-500 mt-1">
            Horas pico: {predictions?.peakHours || '10:00 - 12:00'}
          </p>
        </div>
      </div>

      {/* Recomendaciones IA */}
      <div className="border border-gray-100 bg-white">
        <div className="border-b border-gray-100 px-5 py-4">
          <h3 className="text-xs font-mono text-gray-900 uppercase tracking-wider">
            Recomendaciones inteligentes
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {analytics?.recommendations?.map((rec: any, i: number) => (
            <div key={i} className="px-5 py-4 flex items-start gap-3">
              <Activity className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700">{rec.message}</p>
                <p className="text-xs font-mono text-gray-400 mt-1">
                  Impacto estimado: {rec.estimatedImpact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};