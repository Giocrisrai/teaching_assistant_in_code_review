import React, { useState } from 'react';
import { DEFAULT_RUBRIC } from './constants';
import { useEvaluation } from './hooks/useEvaluation';

import { Header } from './components/Header';
import { RepoInputForm } from './components/RepoInputForm';
import { Loader } from './components/Loader';
import { EvaluationReport } from './components/EvaluationReport';
import { InfoIcon } from './components/icons';
import type { AnalysisInput, AnalysisSource } from './types';
import { hasGeminiKey } from './services/geminiService';

function App() {
  const [analysisSource, setAnalysisSource] = useState<AnalysisSource>('zip');
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [githubToken, setGithubToken] = useState<string>('');
  const [archiveFile, setArchiveFile] = useState<File | null>(null);
  const [supplementaryFiles, setSupplementaryFiles] = useState<File[]>([]);
  const [rubric, setRubric] = useState<string>(DEFAULT_RUBRIC);

  const {
    isLoading,
    error,
    evaluationResult,
    loadingMessage,
    repoName,
    analyzeRepo,
    loadDemo,
  } = useEvaluation();

  const sinClave = !hasGeminiKey();

  const handleAnalyze = () => {
    if (analysisSource === 'github' && repoUrl && rubric) {
      analyzeRepo({ source: 'github', repoUrl, rubric, githubToken }, supplementaryFiles);
    } else if (analysisSource === 'zip' && archiveFile && rubric) {
      analyzeRepo({ source: 'zip', archiveFile, rubric }, supplementaryFiles);
    }
  };

  return (
    <div className="bg-transparent text-gray-100 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-5xl">
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold text-center text-white mb-2">Inicia tu Análisis</h2>
            <p className="text-center text-gray-400 mb-8">Selecciona una fuente, proporciona los detalles y deja que la IA haga el resto.</p>
            <div className="mb-8 p-4 bg-cyan-950/40 border border-cyan-700/50 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-cyan-100/90">
                {sinClave
                  ? 'Demo pública: esta instancia no tiene clave de Gemini, así que no evalúa entregas reales. Mira un informe de ejemplo, o ejecuta la aplicación en local con tu clave.'
                  : '¿Primera vez? Mira un informe de ejemplo antes de evaluar una entrega.'}
              </p>
              <button
                type="button"
                onClick={loadDemo}
                disabled={isLoading}
                className="shrink-0 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-gray-950 font-semibold text-sm transition-colors"
              >
                Ver ejemplo
              </button>
            </div>
            <RepoInputForm
              analysisSource={analysisSource}
              setAnalysisSource={setAnalysisSource}
              repoUrl={repoUrl}
              setRepoUrl={setRepoUrl}
              githubToken={githubToken}
              setGithubToken={setGithubToken}
              archiveFile={archiveFile}
              setArchiveFile={setArchiveFile}
              supplementaryFiles={supplementaryFiles}
              setSupplementaryFiles={setSupplementaryFiles}
              rubric={rubric}
              setRubric={setRubric}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
        </div>

        {isLoading && <div className="animate-fade-in-up"><Loader message={loadingMessage} /></div>}

        {error && (
          <div className="mt-8 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-start space-x-3 animate-fade-in-up">
            <InfoIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-red-300">Error en el Análisis</h3>
              <p className="text-red-300/90 whitespace-pre-wrap">{error}</p>
            </div>
          </div>
        )}

        {evaluationResult && repoName && !isLoading && (
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {repoName.includes('(demo)') && (
              <p className="mt-8 text-sm text-amber-300/90 text-center">
                Informe de ejemplo: caso ficticio escrito a mano, no una evaluación real ni generada en vivo.
              </p>
            )}
            <EvaluationReport result={evaluationResult} repoName={repoName} />
          </div>
        )}
      </main>
      <footer className="text-center p-6 text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Revisor de Código con IA. Creado con React, TypeScript y Gemini.</p>
      </footer>
    </div>
  );
}

export default App;