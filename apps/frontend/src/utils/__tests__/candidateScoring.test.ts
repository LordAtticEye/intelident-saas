import { describe, it, expect } from 'vitest';
import { scoreCandidate, calculateClinicalPriority } from '../candidateScoring';

describe('Pruebas Unitarias & Caja Blanca - scoreCandidate (IA Assisted)', () => {
  // Caso 1: Coincidencia Total (100%)
  it('debe retornar 100 cuando el candidato cumple con todas las habilidades requeridas', () => {
    const candidateSkills = ['React', 'TypeScript', 'Tailwind', 'Next.js', 'Jest'];
    const requiredSkills = ['React', 'TypeScript', 'Next.js'];
    
    const score = scoreCandidate(candidateSkills, requiredSkills);
    expect(score).toBe(100);
  });

  // Caso 2: Coincidencia Parcial (Cálculo proporcional)
  it('debe calcular proporcionalmente el puntaje ante coincidencias parciales (ramas if/bucles)', () => {
    const candidateSkills = ['React', 'CSS'];
    const requiredSkills = ['React', 'TypeScript', 'Next.js', 'Docker']; // 1 de 4 = 25%
    
    const score = scoreCandidate(candidateSkills, requiredSkills);
    expect(score).toBe(25);
  });

  // Caso 3: Lista de habilidades vacía (Frontera cero)
  it('debe retornar 0 cuando la lista de habilidades del candidato está vacía', () => {
    const candidateSkills: string[] = [];
    const requiredSkills = ['React', 'Node.js'];
    
    const score = scoreCandidate(candidateSkills, requiredSkills);
    expect(score).toBe(0);
  });

  // Caso 4: Requisitos vacíos (Cumplimiento por omisión)
  it('debe retornar 100 si el puesto no especifica requisitos obligatorios', () => {
    const candidateSkills = ['React', 'TypeScript'];
    const requiredSkills: string[] = [];
    
    const score = scoreCandidate(candidateSkills, requiredSkills);
    expect(score).toBe(100);
  });

  // Caso 5: Sensibilidad a mayúsculas y espacios en blanco
  it('debe normalizar case-insensitivity y espacios en blanco al comparar habilidades', () => {
    const candidateSkills = ['  rEaCt  ', 'TYPESCRIPT', ' node.js '];
    const requiredSkills = ['react', 'typescript', 'Node.JS'];
    
    const score = scoreCandidate(candidateSkills, requiredSkills);
    expect(score).toBe(100);
  });

  // Caso 6: Sin coincidencias
  it('debe retornar 0 si ninguna habilidad coincide con las requeridas', () => {
    const candidateSkills = ['Python', 'Django'];
    const requiredSkills = ['Java', 'Spring Boot'];
    
    const score = scoreCandidate(candidateSkills, requiredSkills);
    expect(score).toBe(0);
  });
});

describe('Pruebas Unitarias & Caja Blanca - calculateClinicalPriority (InteliDent SaaS)', () => {
  // Rama 1: Emergencia médica activa
  it('debe clasificar como ALTA si se marca como emergencia médica independiente del dolor', () => {
    const priority = calculateClinicalPriority(2, true, 0, false);
    expect(priority).toBe('ALTA');
  });

  // Rama 2: Infección detectada
  it('debe clasificar como ALTA si el paciente presenta infección bucodental activa', () => {
    const priority = calculateClinicalPriority(3, false, 1, true);
    expect(priority).toBe('ALTA');
  });

  // Rama 3: Dolor agudo severo (>= 8)
  it('debe clasificar como ALTA si el nivel de dolor es igual o superior a 8/10', () => {
    const priority = calculateClinicalPriority(8, false, 2, false);
    expect(priority).toBe('ALTA');
  });

  // Rama 4: Dolor moderado (>= 5)
  it('debe clasificar como MEDIA si el nivel de dolor es moderado (5 a 7)', () => {
    const priority = calculateClinicalPriority(6, false, 3, false);
    expect(priority).toBe('MEDIA');
  });

  // Rama 5: Tiempo de espera prolongado (>= 7 días)
  it('debe clasificar como MEDIA si el tiempo de espera supera los 7 días aunque no haya dolor', () => {
    const priority = calculateClinicalPriority(2, false, 8, false);
    expect(priority).toBe('MEDIA');
  });

  // Rama 6: Rutina estándar (Dolor bajo y poco tiempo)
  it('debe clasificar como BAJA en citas de revisión o dolor leve (< 5)', () => {
    const priority = calculateClinicalPriority(1, false, 2, false);
    expect(priority).toBe('BAJA');
  });
});
