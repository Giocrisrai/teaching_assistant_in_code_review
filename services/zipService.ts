import JSZip from 'jszip';
import type { GitHubFile } from '../types';
import { RELEVANT_EXTENSIONS, IGNORED_PATTERNS } from '../constants';
import { extractTextFromPdf } from '../utils/pdfParser';
import { extractTextFromOfficeXml } from '../utils/officeParser';
import { parseAndFormatNotebook } from '../utils/notebookParser';

/**
 * Extracts relevant files and their content from a user-uploaded ZIP file.
 * @param zipFile - The File object uploaded by the user.
 * @returns A promise that resolves to an object containing the files, repo name, and a security warning.
 */
export async function extractFilesFromZip(zipFile: File): Promise<{ files: GitHubFile[], repoName: string, envFileWarning: string }> {
  try {
    const jszip = new JSZip();
    const zip = await jszip.loadAsync(zipFile);
    const filePromises: Promise<GitHubFile | null>[] = [];
    let envFileWarning = '';

    // Remove the .zip extension for a cleaner repo name
    const repoName = zipFile.name.endsWith('.zip') ? zipFile.name.slice(0, -4) : zipFile.name;

    zip.forEach((relativePath, zipEntry) => {
      const lowerPath = zipEntry.name.toLowerCase();
      const isIgnored = IGNORED_PATTERNS.some(pattern => lowerPath.startsWith(pattern) || lowerPath.endsWith(pattern));

      // Ignore directories, irrelevant extensions, and ignored patterns
      if (zipEntry.dir || isIgnored || !RELEVANT_EXTENSIONS.some(ext => lowerPath.endsWith(ext))) {
        return;
      }
      
      // Check for .env file at the root of a potential project directory within the zip
      // e.g. my-project/.env or just .env
      const pathParts = zipEntry.name.split('/');
      if (pathParts.length <= 2 && pathParts[pathParts.length - 1] === '.env') {
           envFileWarning = "\n--- ALERTA DE SEGURIDAD CRÍTICA ---\nSe detectó un archivo `.env` en el archivo ZIP. Este es un anti-patrón de seguridad grave, ya que expone secretos. Este hecho debe ser mencionado en el feedback y penalizado severamente en la categoría de 'Buenas Prácticas'.\n---------------------------------\n";
      }

      const promise = (async (): Promise<GitHubFile | null> => {
        try {
            const lowerName = zipEntry.name.toLowerCase();
            if (lowerName.endsWith('.pdf')) {
                const contentBuffer = await zipEntry.async('arraybuffer');
                const textContent = await extractTextFromPdf(contentBuffer);
                return { path: zipEntry.name, content: textContent };
            } else if (lowerName.endsWith('.docx') || lowerName.endsWith('.pptx')) {
                const contentBuffer = await zipEntry.async('arraybuffer');
                const textContent = await extractTextFromOfficeXml(contentBuffer, zipEntry.name);
                return { path: zipEntry.name, content: textContent };
            } else {
                const content = await zipEntry.async('string');
                if (lowerName.endsWith('.ipynb')) {
                    return { path: zipEntry.name, content: parseAndFormatNotebook(content) };
                }
                return { path: zipEntry.name, content: content };
            }
        } catch (err) {
            console.warn(`No se pudo leer el archivo ${zipEntry.name} del ZIP, se omitirá. Error:`, err);
            return null;
        }
      })();
      
      filePromises.push(promise);
    });

    const allFiles = await Promise.all(filePromises);
    const files = allFiles.filter((f): f is GitHubFile => f !== null);

    return { files, repoName, envFileWarning };

  } catch (error) {
    console.error("Error al procesar el archivo ZIP:", error);
    throw new Error("El archivo proporcionado no es un ZIP válido o está corrupto.");
  }
}