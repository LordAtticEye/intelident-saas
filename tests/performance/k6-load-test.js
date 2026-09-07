/**
 * InteliDent SaaS - Prueba de Rendimiento y Estrés de Carga con k6 (Grafana)
 * Simulación de 50 a 100 Usuarios Virtuales (VUs) concurrentes hacia el servidor en Nube/Docker.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5s', target: 25 },   // Ramp-up inicial
    { duration: '20s', target: 50 },  // Carga sostenida a 50 VUs
    { duration: '5s', target: 0 },    // Ramp-down
  ],
  thresholds: {
    // Criterio de aceptación de la práctica: p95 < 500ms y 0% errores críticos
    http_req_duration: ['p(95)<500', 'p(99)<800'],
    http_req_failed: ['rate<0.01'], // Menos del 1% de fallos
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://intelident.cloud';

export default function () {
  // 1. Healthcheck probe (Monitoreo de disponibilidad del contenedor)
  const healthRes = http.get(`${BASE_URL}/api/health`);
  check(healthRes, {
    'Healthcheck status es 200': (r) => r.status === 200,
    'Healthcheck latencia < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(0.3);

  // 2. Transacción de Carga: Consulta de Citas / Módulo Clínico
  const payload = JSON.stringify({
    applicantName: `Candidato_VU_${__VU}_${__ITER}`,
    email: `vu_${__VU}_iter_${__ITER}@evaluacion.org`,
    skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
    experienceYears: 4,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'k6-load-testing-agent/v0.48.0',
    },
  };

  const evalRes = http.post(`${BASE_URL}/api/candidates`, payload, params);

  check(evalRes, {
    'Status es 200 o 201': (r) => r.status === 200 || r.status === 201,
    'Tiempo de respuesta de inferencia < 450ms': (r) => r.timings.duration < 450,
    'Cuerpo de respuesta contiene id': (r) => r.body.includes('id') || r.body.includes('score') || r.body.includes('status'),
  });

  sleep(1);
}
