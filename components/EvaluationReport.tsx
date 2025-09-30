
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { EvaluationResult } from '../types';
import { ScoreDonut } from './ScoreDonut';
import { RubricItem } from './RubricItem';
import { DownloadIcon, JsonIcon } from './icons';
import { getScoreColorClass } from '../utils';

interface EvaluationReportProps {
  result: EvaluationResult;
  repoName: string;
}

export const EvaluationReport: React.FC<EvaluationReportProps> = ({ result, repoName }) => {
  const { overallScore, summary, report, finalChileanGrade } = result;
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(result, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `evaluation-report-${repoName}.json`;
    link.click();
  };

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pdfWidth - margin * 2;
      let cursorY = margin;

      const addElement = async (element: HTMLElement) => {
        const canvas = await html2canvas(element, {
          scale: 2,
          backgroundColor: '#111827',
          useCORS: true,
        });
        const imgData = canvas.toDataURL('image/png');
        const imgHeight = (canvas.height * contentWidth) / canvas.width;

        if (cursorY + imgHeight > pdfHeight - margin) {
          pdf.addPage();
          cursorY = margin;
        }

        pdf.addImage(imgData, 'PNG', margin, cursorY, contentWidth, imgHeight);
        cursorY += imgHeight + 7; // Add 7mm spacing
      };

      // Process elements one by one to ensure proper pagination
      const headerEl = document.getElementById('report-header');
      if (headerEl) await addElement(headerEl);

      const summarySectionEl = document.getElementById('report-summary-section');
      if (summarySectionEl) await addElement(summarySectionEl);
      
      const detailedTitleEl = document.getElementById('report-detailed-title');
      if(detailedTitleEl) await addElement(detailedTitleEl);

      const itemElements = document.querySelectorAll<HTMLElement>('.rubric-item-container');
      for (const itemEl of itemElements) {
        await addElement(itemEl);
      }

      pdf.save(`evaluation-report-${repoName}.pdf`);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Hubo un error al generar el PDF. Revisa la consola para más detalles.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const finalGradeColor = finalChileanGrade >= 4.0 ? getScoreColorClass(80) : getScoreColorClass(20);

  return (
    <div className="mt-8 space-y-8 animate-fade-in">
      <header id="report-header" className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">Reporte de Evaluación</h2>
            <p className="text-gray-400">
              Análisis del repositorio: <span className="font-semibold text-cyan-400">{repoName}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700/50 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              title="Descargar reporte formateado en PDF"
            >
              <DownloadIcon className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Generando...' : 'PDF'}</span>
            </button>
             <button
              onClick={handleDownloadJson}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700/50 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors disabled:opacity-50"
              title="Descargar datos crudos en JSON"
            >
              <JsonIcon className="w-4 h-4" />
              <span>JSON</span>
            </button>
          </div>
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
      
      <section id="report-summary-section">
        <h3 className="text-xl font-semibold mb-4 text-gray-200">Resumen de la Evaluación</h3>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <p className="text-gray-300 whitespace-pre-wrap">{summary}</p>
        </div>
      </section>

      <section>
        <h3 id="report-detailed-title" className="text-xl font-semibold mb-4 text-gray-200">Evaluación Detallada por Criterio</h3>
        <div className="space-y-4">
          {report.map((item, index) => (
            <div key={index} className="rubric-item-container">
              <RubricItem item={item} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
