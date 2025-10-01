import React, { useState } from 'react';
import { DEFAULT_RUBRIC } from './constants';
import { useEvaluation } from './hooks/useEvaluation';

import { Header } from './components/Header';
import { RepoInputForm } from './components/RepoInputForm';
import { Loader } from './components/Loader';
import { EvaluationReport } from './components/EvaluationReport';
import { InfoIcon } from './components/icons';

// FIX: Implement the main App component to structure the application UI and manage state.
function App() {
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [rubric, setRubric] = useState<string>(DEFAULT_RUBRIC);

  const {
    isLoading,
    error,
    evaluationResult,
    loadingMessage,
    repoName,
    analyzeRepo,
  } = useEvaluation();

  const handleAnalyze = () => {
    if (repoUrl && rubric) {
      analyzeRepo(repoUrl, rubric);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
        <RepoInputForm
          repoUrl={repoUrl}
          setRepoUrl={setRepoUrl}
          rubric={rubric}
          setRubric={setRubric}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        {isLoading && <Loader message={loadingMessage} />}

        {error && (
          <div className="mt-8 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-start space-x-3 animate-fade-in">
            <InfoIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-red-300">Error en el Análisis</h3>
              <p className="text-red-300/90">{error}</p>
            </div>
          </div>
        )}

        {evaluationResult && repoName && !isLoading && (
          <EvaluationReport result={evaluationResult} repoName={repoName} />
        )}
      </main>
      <footer className="text-center p-4 text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Revisor de Código con IA. Creado con React, TypeScript y Gemini.</p>
      </footer>
    </div>
  );
}

export default App;
