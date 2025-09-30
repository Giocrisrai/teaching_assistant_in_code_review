
import React from 'react';
import type { EvaluationResult } from '../types';
import { ScoreDonut } from './ScoreDonut';
import { RubricItem } from './RubricItem';
import { DownloadIcon } from './icons';
import { getScoreColorClass } from '../utils';

interface EvaluationReportProps {
  result: EvaluationResult;
  repoName: string;
}

export const EvaluationReport: React.FC<EvaluationReportProps> = ({ result, repoName }) => {
  const { overallScore, summary, report, finalChileanGrade } = result;

  const handleDownload = () => {
    const reportJson = JSON.stringify(result, null, 2);
    const blob = new Blob([reportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluation-report-${repoName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const finalGradeColor = finalChileanGrade >= 4.0 ? getScoreColorClass(80) : getScoreColorClass(20);

  return (
    <div className="mt-8 space-y-8 animate-fade-in">
      <header className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">Reporte de Evaluación</h2>
            <p className="text-gray-400">
              Análisis del repositorio: <span className="font-semibold text-cyan-400">{repoName}</span>
            </p>
          </div>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700/50 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>Descargar JSON</span>
          </button>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-around gap-6 text-center">
            <div className="flex flex-col items-center">
                 <ScoreDonut score={overallScore} />
                 <p className="mt-2 text-sm text-gray-400">Puntaje General (0-100)</p>
            </div>
             <div className="flex flex-col items-center">
                 <div className="w-[120px] h-[120px] flex flex-col items-center justify-center bg-gray-900/50 rounded-full border-2 border-gray-700">
                     <span className={`text-4xl font-bold ${finalGradeColor}`}>{finalChileanGrade.toFixed(1)}</span>
                     <span className="text-xs text-gray-400">/ 7.0</span>
                 </div>
                 <p className="mt-2 text-sm text-gray-400">Nota Final (Escala Chilena)</p>
            </div>
        </div>
      </header>
      
      <section>
        <h3 className="text-xl font-semibold mb-4 text-gray-200">Resumen de la Evaluación</h3>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <p className="text-gray-300 whitespace-pre-wrap">{summary}</p>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4 text-gray-200">Evaluación Detallada por Criterio</h3>
        <div className="space-y-4">
          {report.map((item, index) => (
            <RubricItem key={index} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};
