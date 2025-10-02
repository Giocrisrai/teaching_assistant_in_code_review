import React, { useState, useCallback } from 'react';
import { GithubIcon, KeyIcon, EyeIcon, EyeOffIcon, UploadIcon, ZipIcon } from './icons';
import type { AnalysisSource } from '../types';

interface RepoInputFormProps {
  analysisSource: AnalysisSource;
  setAnalysisSource: (source: AnalysisSource) => void;
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  githubToken: string;
  setGithubToken: (token: string) => void;
  zipFile: File | null;
  setZipFile: (file: File | null) => void;
  rubric: string;
  setRubric: (rubric: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const RepoInputForm: React.FC<RepoInputFormProps> = ({
  analysisSource,
  setAnalysisSource,
  repoUrl,
  setRepoUrl,
  githubToken,
  setGithubToken,
  zipFile,
  setZipFile,
  rubric,
  setRubric,
  onAnalyze,
  isLoading,
}) => {
  const [showToken, setShowToken] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      if (files[0].type === 'application/zip' || files[0].type === 'application/x-zip-compressed') {
        setZipFile(files[0]);
      } else {
        alert("Por favor, sube un archivo .zip válido.");
      }
    }
  };
  
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze();
  };
  
  const isSubmitDisabled = isLoading || (analysisSource === 'github' && !repoUrl.trim()) || (analysisSource === 'zip' && !zipFile);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      
      <div>
        <div className="flex border-b border-gray-600">
          <TabButton
            label="GitHub"
            icon={<GithubIcon className="h-5 w-5 mr-2" />}
            isActive={analysisSource === 'github'}
            onClick={() => setAnalysisSource('github')}
            disabled={isLoading}
          />
          <TabButton
            label="Subir ZIP"
            icon={<ZipIcon className="h-5 w-5 mr-2" />}
            isActive={analysisSource === 'zip'}
            onClick={() => setAnalysisSource('zip')}
            disabled={isLoading}
          />
        </div>

        <div className="pt-6">
          {analysisSource === 'github' ? (
            <GitHubInputFields
              repoUrl={repoUrl}
              setRepoUrl={setRepoUrl}
              githubToken={githubToken}
              setGithubToken={setGithubToken}
              showToken={showToken}
              setShowToken={setShowToken}
              isLoading={isLoading}
            />
          ) : (
            <ZipInputField
              zipFile={zipFile}
              setZipFile={setZipFile}
              isLoading={isLoading}
              isDragging={isDragging}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onFileChange={handleFileChange}
            />
          )}
        </div>
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
          disabled={isSubmitDisabled}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analizando...' : (analysisSource === 'github' ? 'Analizar Repositorio' : 'Analizar Archivo ZIP')}
        </button>
      </div>
    </form>
  );
};

// --- Sub-components for clarity ---

const TabButton: React.FC<{ label: string; icon: React.ReactNode; isActive: boolean; onClick: () => void; disabled: boolean }> = ({ label, icon, isActive, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 -mb-px
      ${isActive
        ? 'border-cyan-500 text-cyan-400'
        : 'border-transparent text-gray-400 hover:text-white hover:border-gray-400'
      }
      focus:outline-none transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {icon}
    {label}
  </button>
);

const GitHubInputFields: React.FC<any> = ({ repoUrl, setRepoUrl, githubToken, setGithubToken, showToken, setShowToken, isLoading }) => (
  <div className="space-y-6">
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
        Token de Acceso de GitHub (Opcional, pero recomendado)
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
          autoComplete="off"
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
          {showToken ? <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-200" /> : <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-200" />}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Requerido para repositorios privados. Recomendado para repositorios públicos para evitar límites de la API.
      </p>
    </div>
  </div>
);

const ZipInputField: React.FC<any> = ({ zipFile, setZipFile, isLoading, isDragging, onDragEnter, onDragLeave, onDragOver, onDrop, onFileChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">
      Archivo del Proyecto (.zip)
    </label>
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors
        ${isDragging ? 'border-cyan-500 bg-cyan-900/20' : 'border-gray-600 hover:border-gray-500'}
        ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <div className="space-y-1 text-center">
        {zipFile ? (
            <>
                <ZipIcon className="mx-auto h-12 w-12 text-cyan-400" />
                <p className="text-sm text-gray-300 font-semibold">{zipFile.name}</p>
                <p className="text-xs text-gray-500">{(zipFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <button
                    type="button"
                    onClick={() => setZipFile(null)}
                    disabled={isLoading}
                    className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                    Quitar archivo
                </button>
            </>
        ) : (
            <>
                <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
                <div className="flex text-sm text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-cyan-400 hover:text-cyan-300 focus-within:outline-none"
                  >
                    <span>Sube un archivo</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".zip,application/zip" onChange={(e) => onFileChange(e.target.files)} disabled={isLoading} />
                  </label>
                  <p className="pl-1">o arrástralo y suéltalo aquí</p>
                </div>
                <p className="text-xs text-gray-500">Solo archivos .zip</p>
            </>
        )}
      </div>
    </div>
  </div>
);