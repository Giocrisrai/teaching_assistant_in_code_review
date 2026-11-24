// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { renderFeedbackHtml } from '../utils/feedbackHtml';

describe('renderFeedbackHtml', () => {
  it('convierte Markdown en HTML', () => {
    const html = renderFeedbackHtml('**Fortalezas:** usa `conf/base` y una lista:\n\n- uno\n- dos');
    expect(html).toContain('<strong>Fortalezas:</strong>');
    expect(html).toContain('<code>conf/base</code>');
    expect(html).toContain('<li>uno</li>');
  });

  it('elimina scripts y manejadores de eventos que vengan en la respuesta del modelo', () => {
    const html = renderFeedbackHtml(
      'Buen trabajo <script>alert(1)</script> <img src="x" onerror="alert(2)"> fin',
    );
    expect(html).not.toContain('<script');
    expect(html).not.toContain('onerror');
    expect(html).not.toContain('alert(');
    expect(html).toContain('Buen trabajo');
  });

  it('neutraliza enlaces javascript: y conserva los normales', () => {
    const html = renderFeedbackHtml(
      '[malo](javascript:alert(1)) y [bueno](https://example.com/guia)',
    );
    expect(html).not.toContain('javascript:');
    expect(html).toContain('href="https://example.com/guia"');
  });

  it('devuelve cadena vacia sin texto', () => {
    expect(renderFeedbackHtml('')).toBe('');
  });
});
