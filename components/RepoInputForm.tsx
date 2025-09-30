import React from 'react';
import { DEFAULT_RUBRIC } from '../constants';

interface RepoInputFormProps {
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  rubric: string;
  setRubric: (rubric: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const RepoInputForm: React.FC<RepoInputFormProps> = ({
  repoUrl,
  setRepoUrl,
  rubric,
  setRubric,
  onAnalyze,
  isLoading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze();
  };

  const handleRestoreRubric = () => {
    setRubric(DEFAULT_RUBRIC);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg">
      <div>
        <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-300 mb-2">
          URL del Repositorio de GitHub
        </label>
        <input
          type="url"
          id="repoUrl"
          name="repoUrl"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/owner/repo"
          required
          className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="rubric" className="block text-sm font-medium text-gray-300">
            Rúbrica de Evaluación
          </label>
          <button
            type="button"
            onClick={handleRestoreRubric}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Restaurar por defecto
          </button>
        </div>
        <textarea
          id="rubric"
          name="rubric"
          rows={10}
          value={rubric}
          onChange={(e) => setRubric(e.target.value)}
          required
          className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-gray-100 font-mono text-xs focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !repoUrl}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Analizando...' : 'Analizar Repositorio'}
      </button>
    </form>
  );
};
