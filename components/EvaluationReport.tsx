// FIX: Implement the EvaluationReport component to display analysis results.
import React, { useState } from 'react';
import type { EvaluationResult } from '../types';
import { ScoreDonut } from './ScoreDonut';
import { RubricItem } from './RubricItem';
import { FeedbackRenderer } from './FeedbackRenderer';
import { JsonIcon, DownloadIcon } from './icons';
import { generatePdf } from '../utils/pdfGenerator';


interface EvaluationReportProps {
  result: EvaluationResult;
  repoName: string;
}

export const EvaluationReport: React.FC<EvaluationReportProps> = ({ result, repoName }) => {
  const { overallScore, summary, professionalismSummary, report, finalChileanGrade } = result;
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const handleDownloadJson = () => {
    const jsonString = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluation-report-${repoName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    await generatePdf('evaluation-report-content', repoName);
    setIsGeneratingPdf(false);
  };


  return (
    <div className="mt-8 animate-fade-in">
      {/* Wrapper div that will be captured for the PDF */}
      <div id="evaluation-report-content" className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
        
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-6 border-b border-gray-700">
          <div className='flex-1'>
             <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Reporte de Evaluación</h2>
                  <p className="text-gray-400">Análisis del repositorio: <span className="font-semibold text-cyan-400">{repoName}</span></p>
                </div>
                 {/* Action Buttons - Moved to top right */}
                <div className="flex flex-shrink-0 gap-3">
                    <button
                        onClick={handleDownloadPdf}
                        disabled={isGeneratingPdf}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-600 rounded-md shadow-sm text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-wait"
                        title="Descargar reporte en PDF"
                      >
                        <DownloadIcon className="w-4 h-4" />
                        <span>PDF</span>
                    </button>
                    <button
                        onClick={handleDownloadJson}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-600 rounded-md shadow-sm text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors"
                        title="Descargar reporte en JSON"
                    >
                        <JsonIcon className="w-4 h-4" />
                        <span>JSON</span>
                    </button>
                </div>
              </div>

            <div className="mt-4 text-lg">
              <span>Nota Final: </span>
              <span className="font-bold text-2xl text-white">{finalChileanGrade.toFixed(1)}</span>
              <span className="text-gray-400 ml-2">(Puntaje: {overallScore.toFixed(1)} / 100)</span>
            </div>
          </div>

          <div className="flex-shrink-0 self-center sm:self-end">
            <ScoreDonut score={overallScore} />
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Resumen General</h3>
            <div className="prose prose-invert prose-p:text-gray-300 bg-black/20 p-4 rounded-md">
              <FeedbackRenderer text={summary} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Análisis de Profesionalismo y Buenas Prácticas</h3>
            <div className="prose prose-invert prose-p:text-gray-300 bg-black/20 p-4 rounded-md">
              <FeedbackRenderer text={professionalismSummary} />
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Desglose por Criterio</h3>
          <div className="space-y-4">
            {report.map((item, index) => (
              <RubricItem key={index} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};