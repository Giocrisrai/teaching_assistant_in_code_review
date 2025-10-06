
import React, { useState, useCallback, useMemo } from 'react';
import { GithubIcon, KeyIcon, EyeIcon, EyeOffIcon, UploadIcon, ZipIcon } from './icons';
import type { AnalysisSource } from '../types';
import { PREDEFINED_RUBRICS } from '../constants';

interface RepoInputFormProps {
  analysisSource: AnalysisSource;
  setAnalysisSource: (source: AnalysisSource) => void;
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  githubToken: string;
  setGithubToken: (token: string) => void;
  archiveFile: File | null;
  setArchiveFile: (file: File | null) => void;
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
  archiveFile,
  setArchiveFile,
  rubric,
  setRubric,
  onAnalyze,
  isLoading,
}) => {
  const [showToken, setShowToken] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Default to the 'zip' upload tab
  useState(() => {
    setAnalysisSource('zip');
  });

  const selectedRubricName = useMemo(() => {
    const matchingRubric = PREDEFINED_RUBRICS.find(r => r.content.trim() === rubric.trim());
    return matchingRubric ? matchingRubric.name : 'Personalizada';
  }, [rubric]);

  const handleRubricSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const selectedRubric = PREDEFINED_RUBRICS.find(r => r.name === selectedName);
    if (selectedRubric) {
      setRubric(selectedRubric.content);
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const acceptedTypes = ['application/zip', 'application/x-zip-compressed'];
      const acceptedExtensions = ['.zip'];
      
      const fileTypeIsAccepted = acceptedTypes.includes(file.type);
      const fileNameIsAccepted = acceptedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

      if (fileTypeIsAccepted || fileNameIsAccepted) {
        setArchiveFile(file);
      } else {
        alert("Formato no soportado. Por favor, sube un archivo .zip.");
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
  
  const isSubmitDisabled = isLoading || (analysisSource === 'github' && !repoUrl.trim()) || (analysisSource === 'zip' && !archiveFile);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-gray-700/80 shadow-2xl shadow-cyan-900/10">
      
      <div>
        <div className="flex justify-center bg-gray-800/60 p-1 rounded-full">
           <TabButton
            label="Subir .ZIP"
            icon={<ZipIcon className="h-5 w-5 mr-2" />}
            isActive={analysisSource === 'zip'}
            onClick={() => setAnalysisSource('zip')}
            disabled={isLoading}
          />
          <TabButton
            label="GitHub"
            icon={<GithubIcon className="h-5 w-5 mr-2" />}
            isActive={analysisSource === 'github'}
            onClick={() => setAnalysisSource('github')}
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
              archiveFile={archiveFile}
              setArchiveFile={setArchiveFile}
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
        <div className="flex justify-between items-center mb-2">
            <label htmlFor="rubric" className="block text-sm font-medium text-gray-300">
                Rúbrica de Evaluación
            </label>
            <select
                id="rubric-selector"
                value={selectedRubricName}
                onChange={handleRubricSelectionChange}
                disabled={isLoading}
                aria-label="Seleccionar plantilla de rúbrica"
                className="rounded-md border-gray-600 bg-gray-800/80 py-1 px-2 text-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 sm:text-sm text-xs"
            >
                {PREDEFINED_RUBRICS.map(r => (
                    <option key={r.name} value={r.name}>{r.name}</option>
                ))}
                {selectedRubricName === 'Personalizada' && (
                  <option value="Personalizada">Personalizada</option>
                )}
            </select>
        </div>
        <textarea
          id="rubric"
          name="rubric"
          rows={10}
          value={rubric}
          onChange={(e) => setRubric(e.target.value)}
          className="block w-full rounded-md border-gray-600 bg-gray-800/50 py-2 px-3 text-gray-200 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 sm:text-sm font-mono text-xs"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? 'Analizando...' : (analysisSource === 'github' ? 'Analizar Repositorio' : 'Analizar Archivo .ZIP')}
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
    className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-full
      ${isActive
        ? 'bg-cyan-500 text-white shadow'
        : 'text-gray-300 hover:bg-white/5'
      }
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {icon}
    {label}
  </button>
);

const GitHubInputFields: React.FC<any> = ({ repoUrl, setRepoUrl, githubToken, setGithubToken, showToken, setShowToken, isLoading }) => (
  <div className="space-y-6">
    <div>
      <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-300 mb-2">
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
          className="block w-full rounded-md border-gray-600 bg-gray-800/50 pl-10 pr-3 py-2 text-gray-200 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 sm:text-sm"
          placeholder="https://github.com/owner/repo"
          required
          disabled={isLoading}
        />
      </div>
    </div>
    <div>
      <label htmlFor="githubToken" className="block text-sm font-medium text-gray-300 mb-2">
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
          className="block w-full rounded-md border-gray-600 bg-gray-800/50 pl-10 pr-10 py-2 text-gray-200 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 sm:text-sm"
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

const ZipInputField: React.FC<any> = ({ archiveFile, setArchiveFile, isLoading, isDragging, onDragEnter, onDragLeave, onDragOver, onDrop, onFileChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
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
        {archiveFile ? (
            <>
                <ZipIcon className="mx-auto h-12 w-12 text-cyan-400" />
                <p className="text-sm text-gray-300 font-semibold">{archiveFile.name}</p>
                <p className="text-xs text-gray-500">{(archiveFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <button
                    type="button"
                    onClick={() => setArchiveFile(null)}
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
                    <span>Sube un archivo .ZIP</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".zip,application/zip,application/x-zip-compressed" onChange={(e) => onFileChange(e.target.files)} disabled={isLoading} />
                  </label>
                  <p className="pl-1">o arrástralo y suéltalo aquí</p>
                </div>
                <p className="text-xs text-gray-500">Método recomendado y más robusto</p>
            </>
        )}
      </div>
    </div>
  </div>
);