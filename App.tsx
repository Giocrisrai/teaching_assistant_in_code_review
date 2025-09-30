
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { RepoInputForm } from './components/RepoInputForm';
import { EvaluationReport } from './components/EvaluationReport';
import { Loader } from './components/Loader';
import { getRepoContents } from './services/githubService';
import { evaluateProject } from './services/geminiService';
import { DEFAULT_RUBRIC } from './constants';
import type { EvaluationResult, GitHubFile } from './types';
import { GithubIcon, InfoIcon } from './components/icons';

const MAX_PROMPT_CHARS = 100000; // Límite de caracteres para el contenido de los archivos

const App: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState<string>('https://github.com/Nazabkn/ML_MyE.git');
  const [rubric, setRubric] = useState<string>(DEFAULT_RUBRIC);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [repoName, setRepoName] = useState<string>('');

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

  const handleAnalyze = useCallback(async () => {
    if (!repoUrl) {
      setError('Por favor, ingresa una URL de repositorio de GitHub válida.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEvaluation(null);

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
  }, [repoUrl, rubric]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <p className="text-center text-gray-400 mb-8">
          Ingresa la URL de un repositorio público de GitHub y una rúbrica de evaluación. La IA analizará el código y proporcionará una evaluación detallada basada en tus criterios.
        </p>
        <RepoInputForm
          repoUrl={repoUrl}
          setRepoUrl={setRepoUrl}
          rubric={rubric}
          setRubric={setRubric}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />
        <div className="mt-6 bg-gray-800/60 border border-yellow-700/50 text-yellow-300/80 px-4 py-3 rounded-lg flex items-start gap-3">
          <InfoIcon className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-400" />
          <div>
            <strong className="font-semibold">Nota para Educadores:</strong>
            <p className="text-sm">Esta herramienta es un asistente de evaluación. Aunque la IA es rigurosa, se recomienda utilizar este reporte como un punto de partida y realizar una revisión final para validar los hallazgos.</p>
          </div>
        </div>
        
        {isLoading && <Loader message={loadingMessage} />}
        
        {error && (
          <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {evaluation && !isLoading && <EvaluationReport result={evaluation} repoName={repoName} />}
        
         <footer className="text-center text-gray-500 mt-12 py-4 border-t border-gray-700">
          <p>Desarrollado con Gemini AI y React</p>
          <a href="https://github.com/google-gemini" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white transition-colors">
            <GithubIcon className="w-5 h-5" />
            <span>Visita Gemini en GitHub</span>
          </a>
        </footer>
      </main>
    </div>
  );
};

export default App;
