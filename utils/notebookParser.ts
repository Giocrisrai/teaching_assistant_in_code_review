import type { JupyterNotebook, NotebookCell } from '../types';

/**
 * Parses the JSON content of a Jupyter Notebook (.ipynb) file into a readable text format.
 * If the content is not valid JSON, it returns the raw content as a fallback.
 * @param rawContent The raw string content of the .ipynb file.
 * @returns A formatted string with the content of the notebook's cells, or the raw content if parsing fails.
 */
export function parseAndFormatNotebook(rawContent: string): string {
  const trimmedContent = rawContent.trim();
  // Basic validation: A valid notebook is a JSON object.
  if (!trimmedContent.startsWith('{') || !trimmedContent.endsWith('}')) {
    // This is likely not a real notebook file, but maybe a .py file misnamed.
    // Return the raw content to avoid a JSON parsing error.
    return rawContent;
  }

  try {
    const notebook: JupyterNotebook = JSON.parse(rawContent);
    if (!notebook.cells || !Array.isArray(notebook.cells)) {
      return "Error: Formato de notebook inválido (no se encontró el arreglo 'cells').\n\n" + rawContent;
    }

    let formattedContent = '';
    notebook.cells.forEach((cell: NotebookCell, index: number) => {
      const source = Array.isArray(cell.source) ? cell.source.join('') : String(cell.source);
      
      if (cell.cell_type === 'markdown') {
        formattedContent += `\n--- Celda de Markdown ${index + 1} ---\n`;
        formattedContent += source;
        formattedContent += `\n--- Fin Celda de Markdown ${index + 1} ---\n`;
      } else if (cell.cell_type === 'code') {
        formattedContent += `\n--- Celda de Código ${index + 1} ---\n`;
        formattedContent += '```python\n';
        formattedContent += source;
        formattedContent += '\n```';
        formattedContent += `\n--- Fin Celda de Código ${index + 1} ---\n`;
      }
    });
    return formattedContent;
  } catch (e) {
    console.error("Error al parsear el contenido del notebook:", e);
    // If JSON parsing still fails, it's a corrupted file. Return the raw content for context.
    return "Error: No se pudo parsear el JSON del notebook. Mostrando contenido en crudo.\n\n" + rawContent;
  }
}
