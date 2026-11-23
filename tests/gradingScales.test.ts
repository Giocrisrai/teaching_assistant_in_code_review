import { describe, expect, it } from 'vitest';
import { calculateChileanGrade } from '../utils/gradingScales';

describe('calculateChileanGrade', () => {
  it.each([
    [60, 0, 1.0],
    [60, 60, 4.0],
    [60, 100, 7.0],
    [50, 0, 1.0],
    [50, 50, 4.0],
    [50, 100, 7.0],
  ] as const)('exigencia %i%%: puntaje %i da nota %f', (escala, puntaje, nota) => {
    expect(calculateChileanGrade(puntaje, escala)).toBe(nota);
  });

  it('con 60% de exigencia, la mitad del puntaje reprueba', () => {
    expect(calculateChileanGrade(50, 60)).toBe(3.5);
  });

  it('con 60% de exigencia, 80 puntos dan un 5.5', () => {
    expect(calculateChileanGrade(80, 60)).toBe(5.5);
  });

  it('la escala proporcional va de 1.0 a 7.0', () => {
    expect(calculateChileanGrade(0, 0)).toBe(1.0);
    expect(calculateChileanGrade(50, 0)).toBe(4.0);
    expect(calculateChileanGrade(100, 0)).toBe(7.0);
  });

  it('acota puntajes fuera de rango', () => {
    expect(calculateChileanGrade(-20, 60)).toBe(1.0);
    expect(calculateChileanGrade(150, 60)).toBe(7.0);
  });

  it('redondea a un decimal', () => {
    const nota = calculateChileanGrade(73, 60);
    expect(Math.round(nota * 10) / 10).toBe(nota);
  });

  it('nunca baja la nota cuando sube el puntaje', () => {
    for (const escala of [0, 50, 60] as const) {
      let anterior = 0;
      for (let puntaje = 0; puntaje <= 100; puntaje++) {
        const nota = calculateChileanGrade(puntaje, escala);
        expect(nota).toBeGreaterThanOrEqual(anterior);
        anterior = nota;
      }
    }
  });
});
