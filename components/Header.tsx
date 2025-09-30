
import React from 'react';
import { AcademicCapIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <AcademicCapIcon className="w-8 h-8 mr-3 text-cyan-400" />
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Revisor de Código con IA</h1>
          <p className="text-sm text-gray-400">Evaluación de Proyectos Automatizada con Gemini</p>
        </div>
      </div>
    </header>
  );
};
