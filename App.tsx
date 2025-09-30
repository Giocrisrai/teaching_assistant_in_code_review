import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { RepoInputForm } from './components/RepoInputForm';
import { EvaluationReport } from './components/EvaluationReport';
import { Loader } from './components/Loader';
import { DEFAULT_RUBRIC } from './constants';
import { GithubIcon, InfoIcon } from './components/icons';
import { useEvaluation } from './hooks/useEvaluation';

const App: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState<string>('https://github.com/Nazabkn/ML_MyE.git');
  const [rubric, setRubric] = useState<string>(DEFAULT_RUBRIC);

  const {
    evaluation,
    isLoading,
    loadingMessage,
    error,
    repoName,
    analyze,
  } = useEvaluation();

  const handleAnalyzeClick = useCallback(() => {
    analyze(repoUrl, rubric);
  }, [repoUrl, rubric, analyze]);

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
          onAnalyze={handleAnalyzeClick}
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
