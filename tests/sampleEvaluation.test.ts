import { describe, expect, it } from 'vitest';
import { SAMPLE_EVALUATION } from '../demo/sampleEvaluation';
import { DEFAULT_RUBRIC } from '../constants';
import { getCriteriaFromRubric } from '../utils/rubricParser';
import { calculateChileanGrade } from '../utils/gradingScales';

describe('evaluación de ejemplo (modo demo)', () => {
  it('cubre exactamente los criterios de la rúbrica por defecto', () => {
    expect(SAMPLE_EVALUATION.report.map(item => item.criterion)).toEqual(
      getCriteriaFromRubric(DEFAULT_RUBRIC),
    );
  });

  it('el puntaje global es el promedio de los criterios', () => {
    const promedio =
      SAMPLE_EVALUATION.report.reduce((acc, item) => acc + item.score, 0) /
      SAMPLE_EVALUATION.report.length;
    expect(SAMPLE_EVALUATION.overallScore).toBe(promedio);
  });

  it('la nota final corresponde a la escala chilena con 60% de exigencia', () => {
    expect(SAMPLE_EVALUATION.finalChileanGrade).toBe(
      calculateChileanGrade(SAMPLE_EVALUATION.overallScore, 60),
    );
  });

  it('todos los puntajes están entre 0 y 100 y traen retroalimentación', () => {
    for (const item of SAMPLE_EVALUATION.report) {
      expect(item.score).toBeGreaterThanOrEqual(0);
      expect(item.score).toBeLessThanOrEqual(100);
      expect(item.feedback.length).toBeGreaterThan(20);
    }
  });
});
