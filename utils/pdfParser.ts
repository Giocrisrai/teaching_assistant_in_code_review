import * as pdfjsLib from 'pdfjs-dist';

// Set the workerSrc to ensure pdf.js can load its worker script from the CDN.
// This is crucial for performance and to avoid blocking the main thread.
const WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;

/**
 * Extracts text content from a PDF file buffer.
 * @param pdfData The PDF file content as an ArrayBuffer.
 * @returns A promise that resolves to the extracted text as a string.
 */
export async function extractTextFromPdf(pdfData: ArrayBuffer): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfData) });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      // The 'str' property exists on TextItem objects. We filter and join them.
      const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
      fullText += pageText + '\n\n'; // Add newlines between pages for readability
    }

    return fullText.trim();
  } catch (error) {
    console.error("Error al procesar el archivo PDF:", error);
    return "Error: No se pudo extraer el texto del archivo PDF. Puede estar corrupto o tener un formato no compatible.";
  }
}
