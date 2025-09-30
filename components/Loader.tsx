import React from 'react';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="mt-8 flex flex-col items-center justify-center p-4" aria-live="polite">
      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-300 text-center">{message || 'Cargando...'}</p>
    </div>
  );
};