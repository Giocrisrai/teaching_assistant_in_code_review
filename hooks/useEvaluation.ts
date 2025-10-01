import { useState, useCallback } from 'react';
import type { EvaluationResult } from '../types';
import { getRepoContents } from '../services/githubService';
import { evaluateRepoWithGemini } from '../services/geminiService';
import { getCriteriaFromRubric } from '../utils/rubricParser';

// FIX: Implement the useEvaluation custom hook to manage the state and logic for the repository analysis process.

export function useEvaluation() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [repoName, setRepoName] = useState<string>('');

  const analyzeRepo = useCallback(async (repoUrl: string, rubric: string) => {
    setIsLoading(true);
    setError(null);
    setEvaluationResult(null);
    setRepoName('');

    try {
      // Step 1: Validate Rubric
      setLoadingMessage('Validando la rúbrica...');
      const criteria = getCriteriaFromRubric(rubric);
      if (criteria.length === 0) {
        throw new Error("La rúbrica proporcionada no tiene un formato válido o no contiene criterios. Asegúrate de que cada criterio comience con '## X. ...'.");
      }
      console.log(`Rúbrica validada, ${criteria.length} criterios encontrados.`);

      // Step 2: Fetch repo contents
      setLoadingMessage('Obteniendo contenido del repositorio desde GitHub...');
      const { files, repoName: fetchedRepoName, envFileWarning } = await getRepoContents(repoUrl);
      setRepoName(fetchedRepoName);
      console.log(`Se obtuvieron ${files.length} archivos relevantes de '${fetchedRepoName}'.`);

      if (files.length === 0) {
        throw new Error("No se encontraron archivos relevantes para analizar en el repositorio o la ruta especificada.");
      }
      
      // Step 3: Call Gemini API for evaluation
      setLoadingMessage(`Analizando ${files.length} archivos con el modelo de IA. Esto puede tardar un momento...`);
      const result = await evaluateRepoWithGemini(files, rubric, envFileWarning);
      console.log('Evaluación completada:', result);

      // Final Step: Set result
      setEvaluationResult(result);

    } catch (e: any) {
      console.error('Error durante el proceso de evaluación:', e);
      setError(e.message || 'Ocurrió un error desconocido.');
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
