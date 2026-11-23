import { describe, expect, it } from 'vitest';
import { getCriteriaFromRubric } from '../utils/rubricParser';

describe('getCriteriaFromRubric', () => {
  it('extrae los criterios de los encabezados H2', () => {
    const rubrica = '# Rúbrica\n\n## 1. Funcionalidad\nDetalle\n\n## 2. Calidad del código\nDetalle';
    expect(getCriteriaFromRubric(rubrica)).toEqual(['1. Funcionalidad', '2. Calidad del código']);
  });

  it('ignora encabezados de otros niveles', () => {
    const rubrica = '# Título\n### Subcriterio\n## Criterio único';
    expect(getCriteriaFromRubric(rubrica)).toEqual(['Criterio único']);
  });

  it('devuelve una lista vacía si no hay criterios o el texto está vacío', () => {
    expect(getCriteriaFromRubric('texto sin encabezados')).toEqual([]);
    expect(getCriteriaFromRubric('')).toEqual([]);
  });
});
