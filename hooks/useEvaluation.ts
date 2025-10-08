import { useState, useCallback } from 'react';
import type { EvaluationResult, AnalysisInput, GitHubFile } from '../types';
import { listRepoFiles, getFilesContent, FILE_LIMIT } from '../services/githubService';
import { extractFilesFromZip } from '../services/zipService';
import { evaluateRepoWithGemini, selectRelevantFilesWithGemini } from '../services/geminiService';
import { getCriteriaFromRubric } from '../utils/rubricParser';
import { extractTextFromPdf } from '../utils/pdfParser';
import { extractTextFromOfficeXml } from '../utils/officeParser';

export function useEvaluation() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [repoName, setRepoName] = useState<string>('');

  const analyzeRepo = useCallback(async (input: AnalysisInput, supplementaryFiles: File[] = []) => {
    setIsLoading(true);
    setError(null);
    setEvaluationResult(null);
    setRepoName('');

    const onProgress = (message: string) => {
        setLoadingMessage(message);
    };

    try {
      // Step 1: Validate Rubric
      onProgress('Validando la rúbrica...');
      const criteria = getCriteriaFromRubric(input.rubric);
      if (criteria.length === 0) {
        throw new Error("La rúbrica proporcionada no tiene un formato válido o no contiene criterios. Asegúrate de que cada criterio comience con '## X. ...'.");
      }

      let repoFiles: GitHubFile[];
      let fetchedRepoName: string;
      let envFileWarning: string;
      
      // Step 2: Fetch files from the selected source
      if (input.source === 'github') {
        const listMessage = input.githubToken 
          ? 'Autenticando y listando archivos del repositorio privado...' 
          : 'Listando archivos del repositorio público...';
        onProgress(listMessage);
        
        const { files: listedFiles, repoName, envFileWarning: warning, defaultBranch, owner } = await listRepoFiles(input.repoUrl, input.githubToken);
        fetchedRepoName = repoName;
        envFileWarning = warning;

        onProgress(`Obteniendo el contenido de ${listedFiles.length} archivos...`);
        repoFiles = await getFilesContent(owner, repoName, defaultBranch, listedFiles, input.githubToken);

      } else { // source is 'zip'
        onProgress(`Procesando el archivo ${input.archiveFile.name}...`);
        
        const extractionResult = await extractFilesFromZip(input.archiveFile);
        repoFiles = extractionResult.files;
        fetchedRepoName = extractionResult.repoName;
        envFileWarning = extractionResult.envFileWarning;
      }
      
      // Step 2.5: Process supplementary files
      onProgress('Procesando archivos complementarios...');
      const supplementaryParsedFiles: GitHubFile[] = [];
      for (const file of supplementaryFiles) {
          // macOS resource fork files start with '._' and are not the actual file.
          // They are not valid PDFs, DOCXs, etc., and will cause parsing errors.
          // Silently ignore them to prevent crashes.
          if (file.name.startsWith('._')) {
              console.warn(`Ignorando archivo de metadatos de macOS: ${file.name}`);
              continue;
          }
          try {
              const buffer = await file.arrayBuffer();
              let content = '';
              const lowerName = file.name.toLowerCase();

              if (lowerName.endsWith('.pdf')) {
                  content = await extractTextFromPdf(buffer);
              } else if (lowerName.endsWith('.docx') || lowerName.endsWith('.pptx')) {
                  content = await extractTextFromOfficeXml(buffer, file.name);
              } else {
                  console.warn(`Archivo complementario no soportado: ${file.name}, se omitirá.`);
                  continue; // Skip unsupported files
              }
              supplementaryParsedFiles.push({
                  path: `archivo_complementario/${file.name}`,
                  content: content
              });
          } catch (e) {
              console.error(`Error al procesar el archivo complementario ${file.name}:`, e);
          }
      }

      const allFiles = [...repoFiles, ...supplementaryParsedFiles];
      setRepoName(fetchedRepoName);
      console.log(`Se encontraron ${repoFiles.length} archivos de repo y ${supplementaryParsedFiles.length} archivos complementarios. Total: ${allFiles.length}.`);


      let filesToProcess = allFiles;

      // Step 3: AI-powered Triage if file count exceeds the limit
      if (allFiles.length > FILE_LIMIT) {
        onProgress(`El proyecto es muy grande (${allFiles.length} archivos). Usando IA para seleccionar los más relevantes...`);
        const allFilePaths = allFiles.map(f => f.path);
        const selectedPaths = await selectRelevantFilesWithGemini(allFilePaths, input.rubric);
        filesToProcess = allFiles.filter(f => selectedPaths.includes(f.path));
        console.log(`La IA seleccionó ${filesToProcess.length} archivos de ${allFiles.length} para el análisis.`);
        onProgress(`La IA seleccionó ${filesToProcess.length} archivos clave. Preparando el análisis...`);
      }

      if (filesToProcess.length === 0) {
        throw new Error("No se encontraron archivos relevantes para analizar. Revisa si el proyecto está vacío o si los archivos están en carpetas ignoradas (como 'clases/' o 'venv/').");
      }
      
      // Step 4: Call Gemini API for evaluation
      onProgress(`Preparando el análisis de ${filesToProcess.length} archivos con el modelo de IA...`);
      const result = await evaluateRepoWithGemini(filesToProcess, input.rubric, envFileWarning, onProgress);
      console.log('Evaluación completada:', result);

      // Final Step: Set result
      setEvaluationResult(result);

    } catch (e: any) {
      console.error('Error durante el proceso de evaluación:', e);
      let displayError = 'Ocurrió un error desconocido.';
      if (e instanceof Error && e.message) {
        const rawMessage = e.message;
        const jsonMatch = rawMessage.match(/{\s*"error":[\s\S]*}/);
        
        if (jsonMatch && jsonMatch[0]) {
          try {
            const errorJson = JSON.parse(jsonMatch[0]);
            const details = errorJson.error;
            if (details && details.message) {
              displayError = `Error de la API de Gemini: ${details.message}`;
              if (details.status) {
                displayError += ` (Estado: ${details.status})`;
              }
              if (details.status === 'INTERNAL') {
                displayError += '. Esto suele ser un problema temporal del servidor, a menudo causado por una solicitud muy grande o compleja. Inténtalo de nuevo más tarde.';
              }
            } else {
              displayError = rawMessage;
            }
          } catch (parseErr) {
            displayError = rawMessage;
          }
        } else {
          displayError = rawMessage;
        }
      }
      setError(displayError);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  return {
    isLoading,
    error,
    evaluationResult,
    loadingMessage,
    repoName,
    analyzeRepo,
  };
}