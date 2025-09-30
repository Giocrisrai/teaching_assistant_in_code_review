import { useState, useCallback } from 'react';
import { getRepoContents } from '../services/githubService';
import { evaluateProject } from '../services/geminiService';
import type { EvaluationResult, GitHubFile } from '../types';

const MAX_PROMPT_CHARS = 100000; // Character limit for file contents

const formatFilesForPrompt = (files: GitHubFile[]): string => {
  let content = '';
  let characterCount = 0;
  const allFilePaths = files.map(f => f.path).join('\n');
  
  content += `Lista completa de archivos en el proyecto:\n${allFilePaths}\n\n--- INICIO DEL CONTENIDO DE ARCHIVOS ---\n`;

  for (const file of files) {
    const fileContent = `
--- ARCHIVO: ${file.path} ---
\`\`\`
${file.content}
\`\`\`
--- FIN ARCHIVO: ${file.path} ---
    `;
    if (characterCount + fileContent.length > MAX_PROMPT_CHARS) {
      content += "\n--- NOTA: El contenido de los archivos restantes ha sido truncado para no exceder el límite de contexto. Evaluar en base a la estructura de archivos y el contenido disponible. ---";
      break;
    }
    content += fileContent;
    characterCount += fileContent.length;
  }

  return content;
};

export const useEvaluation = () => {
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [repoName, setRepoName] = useState<string>('');

  const analyze = useCallback(async (repoUrl: string, rubric: string) => {
    if (!repoUrl) {
      setError('Por favor, ingresa una URL de repositorio de GitHub válida.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEvaluation(null); // Clear previous evaluation for better UX

    try {
      setLoadingMessage('Obteniendo archivos del repositorio desde GitHub...');
      const { files, repoName: extractedRepoName, envFileWarning } = await getRepoContents(repoUrl);
      setRepoName(extractedRepoName);
      if (files.length === 0) {
        throw new Error('No se pudieron obtener archivos del repositorio. Podría ser privado, estar vacío o la URL es incorrecta.');
      }
      
      let projectContext = formatFilesForPrompt(files);
      if (envFileWarning) {
        projectContext = envFileWarning + projectContext;
      }
      
      setLoadingMessage('La IA de Gemini está analizando el código... Esto puede tardar un momento.');
      const result = await evaluateProject(projectContext, rubric);
      
      setEvaluation(result);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Ocurrió un error inesperado durante el análisis. Revisa la consola para más detalles.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  return {
    evaluation,
    isLoading,
    loadingMessage,
    error,
    repoName,
    analyze,
  };
};
