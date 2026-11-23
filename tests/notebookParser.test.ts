import { describe, expect, it, vi } from 'vitest';
import { parseAndFormatNotebook } from '../utils/notebookParser';

const notebook = (cells: unknown[]) => JSON.stringify({ cells });

describe('parseAndFormatNotebook', () => {
  it('formatea celdas de código y de markdown en orden', () => {
    const salida = parseAndFormatNotebook(
      notebook([
        { cell_type: 'markdown', source: ['# Título'] },
        { cell_type: 'code', source: ['import pandas as pd\n', 'df = pd.DataFrame()'] },
      ]),
    );
    expect(salida).toContain('--- Celda de Markdown 1 ---\n# Título');
    expect(salida).toContain('```python\nimport pandas as pd\ndf = pd.DataFrame()\n```');
    expect(salida.indexOf('Markdown 1')).toBeLessThan(salida.indexOf('Código 2'));
  });

  it('acepta el código fuente como cadena única', () => {
    const salida = parseAndFormatNotebook(notebook([{ cell_type: 'code', source: 'print(1)' }]));
    expect(salida).toContain('```python\nprint(1)\n```');
  });

  it('devuelve el contenido tal cual si no es JSON', () => {
    const python = 'print("no soy un notebook")';
    expect(parseAndFormatNotebook(python)).toBe(python);
  });

  it('avisa cuando falta el arreglo de celdas', () => {
    expect(parseAndFormatNotebook('{"metadata": {}}')).toContain('Formato de notebook inválido');
  });

  it('avisa cuando el JSON está corrupto y conserva el contenido', () => {
    const silencio = vi.spyOn(console, 'error').mockImplementation(() => {});
    const corrupto = '{"cells": [}';
    const salida = parseAndFormatNotebook(corrupto);
    expect(salida).toContain('No se pudo parsear el JSON');
    expect(salida).toContain(corrupto);
    silencio.mockRestore();
  });
});
