import { useState, useCallback } from 'react';
import type { EvaluationResult } from '../types';
import { listRepoFiles, getFilesContent, FILE_LIMIT } from '../services/githubService';
import { evaluateRepoWithGemini, selectRelevantFilesWithGemini } from '../services/geminiService';
import { getCriteriaFromRubric } from '../utils/rubricParser';

// FIX: Implement the useEvaluation custom hook to manage the state and logic for the repository analysis process.

export function useEvaluation() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [repoName, setRepoName] = useState<string>('');

  const analyzeRepo = useCallback(async (repoUrl: string, rubric: string, githubToken: string) => {
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
      const criteria = getCriteriaFromRubric(rubric);
      if (criteria.length === 0) {
        throw new Error("La rúbrica proporcionada no tiene un formato válido o no contiene criterios. Asegúrate de que cada criterio comience con '## X. ...'.");
      }
      console.log(`Rúbrica validada, ${criteria.length} criterios encontrados.`);

      // Step 2: List repository files
      const listMessage = githubToken 
        ? 'Autenticando y listando archivos del repositorio privado...' 
        : 'Listando archivos del repositorio público...';
      onProgress(listMessage);

      const { files: allFiles, repoName: fetchedRepoName, envFileWarning, defaultBranch, owner } = await listRepoFiles(repoUrl, githubToken);
      setRepoName(fetchedRepoName);
      console.log(`Se encontraron ${allFiles.length} archivos relevantes en '${fetchedRepoName}'.`);
      
      let filesToProcess = allFiles;

      // Step 3: AI-powered Triage if file count exceeds the limit
      if (allFiles.length > FILE_LIMIT) {
        onProgress(`El proyecto es muy grande (${allFiles.length} archivos). Usando IA para seleccionar los más relevantes...`);
        const allFilePaths = allFiles.map(f => f.path);
        const selectedPaths = await selectRelevantFilesWithGemini(allFilePaths, rubric);
        filesToProcess = allFiles.filter(f => selectedPaths.includes(f.path));
        console.log(`La IA seleccionó ${filesToProcess.length} archivos de ${allFiles.length} para el análisis.`);
        onProgress(`La IA seleccionó ${filesToProcess.length} archivos clave. Obteniendo su contenido...`);
      } else {
        onProgress(`Obteniendo el contenido de ${allFiles.length} archivos...`);
      }

      if (filesToProcess.length === 0) {
        throw new Error("No se encontraron o seleccionaron archivos relevantes para analizar en el repositorio o la ruta especificada.");
      }
      
      // Step 4: Fetch content of the selected files
      const files = await getFilesContent(owner, fetchedRepoName, defaultBranch, filesToProcess, githubToken);

      // Step 5: Call Gemini API for evaluation
      onProgress(`Preparando el análisis de ${files.length} archivos con el modelo de IA...`);
      const result = await evaluateRepoWithGemini(files, rubric, envFileWarning, onProgress);
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