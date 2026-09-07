/**
 * InteliDent SaaS - Helper de Evaluación y Scoring de Candidatos / Prioridad
 * Lógica de negocio para pruebas de Caja Blanca y Unitarias.
 */

export interface CandidateScoreResult {
  score: number;
  percentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  isQualified: boolean;
}

/**
 * Evalúa las habilidades de un candidato odontólogo/asistente contra los requisitos requeridos.
 * Diseñado para pruebas exhaustivas de Caja Blanca (ramas, bucles y condiciones de frontera).
 * 
 * @param skills Habilidades presentadas por el postulante
 * @param requiredSkills Habilidades obligatorias para la vacante
 * @returns Score de 0 a 100
 */
export function scoreCandidate(
  skills: string[],
  requiredSkills: string[]
): number {
  if (!requiredSkills || requiredSkills.length === 0) {
    return 100; // Si no hay requisitos, cumple al 100%
  }

  if (!skills || skills.length === 0) {
    return 0; // Si no presenta habilidades, puntaje cero
  }

  // Normalización a minúsculas para comparaciones consistentes
  const normalizedSkills = new Set(
    skills.map((s) => s.trim().toLowerCase()).filter(Boolean)
  );

  const normalizedRequired = requiredSkills
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (normalizedRequired.length === 0) {
    return 100;
  }

  let matches = 0;
  for (const req of normalizedRequired) {
    if (normalizedSkills.has(req)) {
      matches++;
    }
  }

  const score = Math.round((matches / normalizedRequired.length) * 100);
  return Math.min(100, Math.max(0, score));
}

/**
 * Calcula la prioridad clínica de una cita odontológica según severidad y factores de riesgo.
 * Función de lógica interna con múltiples ramificaciones para análisis de cobertura de código.
 */
export function calculateClinicalPriority(
  painLevel: number, // 0 - 10
  isEmergency: boolean,
  daysWaiting: number,
  hasInfection: boolean
): 'ALTA' | 'MEDIA' | 'BAJA' {
  if (isEmergency || hasInfection || painLevel >= 8) {
    return 'ALTA';
  }

  if (painLevel >= 5 || daysWaiting >= 7) {
    return 'MEDIA';
  }

  return 'BAJA';
}
