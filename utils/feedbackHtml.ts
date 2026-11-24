import DOMPurify from 'dompurify';
import { marked } from 'marked';

/**
 * Converts the model's Markdown feedback into HTML that is safe to inject.
 *
 * The feedback is model output about code a student wrote, so it is untrusted:
 * a submission can carry text that steers the model into emitting HTML, and
 * Markdown lets raw HTML through. Everything is sanitised before it reaches the
 * page, which removes scripts, event handlers and `javascript:` links.
 */
export function renderFeedbackHtml(text: string): string {
  if (!text) return '';
  const html = marked.parse(text, { async: false }) as string;
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}
