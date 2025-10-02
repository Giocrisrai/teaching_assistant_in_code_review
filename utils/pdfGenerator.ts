import jsPDF from 'jspdf';
import { marked } from 'marked';
import type { EvaluationResult } from '../types';
import { generateMarkdownReport } from './markdownGenerator';

/**
 * Generates a high-quality PDF report from an evaluation result by converting Markdown to HTML.
 * @param result The evaluation result object.
 * @param repoName The name of the repository that was evaluated.
 */
export async function generatePdfReport(result: EvaluationResult, repoName: string): Promise<void> {
  try {
    const markdownContent = generateMarkdownReport(result, repoName);
    
    // Convert Markdown to HTML
    const htmlContent = await marked.parse(markdownContent);

    // Create a new jsPDF instance
    const doc = new jsPDF({
      unit: 'pt',
      format: 'a4',
    });
    
    // Define styles for the PDF content
    const styles = `
      <style>
        body { font-family: Helvetica, sans-serif; font-size: 10pt; color: #111827; }
        h1 { font-size: 18pt; font-weight: bold; color: #0891b2; margin-bottom: 20pt; }
        h2 { font-size: 14pt; font-weight: bold; color: #0e7490; border-bottom: 1px solid #e5e7eb; padding-bottom: 5pt; margin-top: 20pt; margin-bottom: 10pt; }
        h3 { font-size: 12pt; font-weight: bold; color: #164e63; margin-top: 15pt; margin-bottom: 5pt; }
        p, li { line-height: 1.5; }
        strong { font-weight: bold; }
        pre { background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 4px; padding: 8pt; font-family: Courier, monospace; font-size: 9pt; white-space: pre-wrap; word-wrap: break-word; }
        code { font-family: Courier, monospace; background-color: #e0f2fe; padding: 1pt 3pt; border-radius: 3px; }
        hr { border: 0; border-top: 1px solid #e5e7eb; margin: 15pt 0; }
      </style>
    `;
    
    // Add the HTML content to the PDF
    await doc.html(styles + htmlContent, {
      callback: function (doc) {
        doc.save(`Evaluacion-${repoName}.pdf`);
      },
      x: 35,
      y: 35,
      width: 525, // A4 width in points is ~595. Margins: (595 - 525) / 2 = 35pt
      windowWidth: 700,
    });

  } catch (error) {
    console.error("Error al generar el PDF:", error);
    alert("Hubo un error al generar el reporte en PDF. Por favor, intente descargar el formato Markdown en su lugar.");
  }
}
