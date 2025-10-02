
import React from 'react';
import { AcademicCapIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-950/30 backdrop-blur-lg sticky top-0 z-50 border-b border-white/10">
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