// FIX: Implement the RepoInputForm component to allow users to input repo details for analysis.
import React, { useState } from 'react';
import { GithubIcon, KeyIcon, EyeIcon, EyeOffIcon } from './icons';

interface RepoInputFormProps {
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  githubToken: string;
  setGithubToken: (token: string) => void;
  rubric: string;
  setRubric: (rubric: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const RepoInputForm: React.FC<RepoInputFormProps> = ({
  repoUrl,
  setRepoUrl,
  githubToken,
  setGithubToken,
  rubric,
  setRubric,
  onAnalyze,
  isLoading,
}) => {
  const [showToken, setShowToken] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <div>
        <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-300 mb-1">
          URL del Repositorio de GitHub
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <GithubIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            id="repoUrl"
            name="repoUrl"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="block w-full rounded-md border-gray-600 bg-gray-900/50 pl-10 pr-3 py-2 text-gray-200 placeholder-gray-500 focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
            placeholder="https://github.com/owner/repo"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="githubToken" className="block text-sm font-medium text-gray-300 mb-1">
          Token de Acceso de GitHub (Opcional)
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <KeyIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showToken ? 'text' : 'password'}
            id="githubToken"
            name="githubToken"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            className="block w-full rounded-md border-gray-600 bg-gray-900/50 pl-10 pr-10 py-2 text-gray-200 placeholder-gray-500 focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
            placeholder="ghp_..."
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowToken(!showToken)}
            aria-label={showToken ? 'Ocultar token' : 'Mostrar token'}
          >
            {showToken ? (
              <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-200" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-200" />
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Recomendado para repositorios privados o para evitar límites de la API pública. El token nunca se almacena.
        </p>
      </div>

      <div>
        <label htmlFor="rubric" className="block text-sm font-medium text-gray-300 mb-1">
          Rúbrica de Evaluación
        </label>
        <textarea
          id="rubric"
          name="rubric"
          rows={10}
          value={rubric}
          onChange={(e) => setRubric(e.target.value)}
          className="block w-full rounded-md border-gray-600 bg-gray-900/50 py-2 px-3 text-gray-200 placeholder-gray-500 focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm font-mono text-xs"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading || !repoUrl.trim()}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analizando...' : 'Analizar Repositorio'}
        </button>
      </div>
    </form>
  );
};
