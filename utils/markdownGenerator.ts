import type { EvaluationResult } from '../types';

/**
 * Generates a Markdown formatted report from an evaluation result.
 * @param result The evaluation result object.
 * @param repoName The name of the repository that was evaluated.
 * @returns A string containing the report in Markdown format.
 */
export function generateMarkdownReport(result: EvaluationResult, repoName: string): string {
  let markdown = `# Reporte de Evaluación para: ${repoName}\n\n`;

  markdown += `## Resumen General\n\n`;
  markdown += `**Puntaje General:** ${result.overallScore.toFixed(1)} / 100\n`;
  markdown += `**Nota Final (Escala Chilena):** ${result.finalChileanGrade.toFixed(1)}\n\n`;
  markdown += `${result.summary}\n\n`;

  markdown += `### Profesionalismo y Buenas Prácticas\n\n`;
  markdown += `${result.professionalismSummary}\n\n`;

  markdown += `## Desglose por Criterio\n\n`;

  result.report.forEach(item => {
    markdown += `### ${item.criterion}\n\n`;
    markdown += `**Puntaje:** ${item.score} / 100\n\n`;
    markdown += `**Feedback:**\n`;
    markdown += `${item.feedback}\n\n`;
    markdown += `---\n\n`;
  });

  return markdown;
}

/**
 * Triggers a file download in the browser for the given text content.
 * @param filename The name of the file to be downloaded.
 * @param content The text content of the file.
 */
export function downloadFile(filename: string, content: string) {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
}
