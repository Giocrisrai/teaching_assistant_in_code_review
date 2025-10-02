// FIX: Implement the EvaluationReport component to display analysis results.
import React from 'react';
import type { EvaluationResult, EvaluationItem } from '../types';
import { ScoreDonut } from './ScoreDonut';
import { RubricItem } from './RubricItem';
import { FeedbackRenderer } from './FeedbackRenderer';
import { JsonIcon, DownloadIcon, PencilIcon } from './icons';
import { generatePdf } from '../utils/pdfGenerator';


interface EvaluationReportProps {
  result: EvaluationResult;
  repoName: string;
}

export const EvaluationReport: React.FC<EvaluationReportProps> = ({ result, repoName }) => {
  // FIX: Use React.useState to resolve "Cannot find name 'useState'" error.
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [editableResult, setEditableResult] = React.useState<EvaluationResult>(result);
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState<boolean>(false);

  // When the original result prop changes (e.g., a new analysis), reset the editable state.
  // FIX: Use React.useEffect to resolve "Cannot find name 'useEffect'" error.
  React.useEffect(() => {
    setEditableResult(result);
    setIsEditing(false); // Also reset editing mode
  }, [result]);

  const recalculateScores = (updatedReport: EvaluationItem[]): { newOverall: number; newGrade: number } => {
    if (updatedReport.length === 0) return { newOverall: 0, newGrade: 1.0 };
    const totalScore = updatedReport.reduce((acc, item) => acc + item.score, 0);
    const newOverall = totalScore / updatedReport.length;
    const calculatedGrade = (newOverall / 100) * 6 + 1;
    const newGrade = Math.floor(Math.min(7.0, Math.max(1.0, calculatedGrade)) * 10) / 10;
    return { newOverall, newGrade };
  };

  const handleScoreChange = (criterion: string, newScore: number) => {
    const updatedReport = editableResult.report.map(item =>
      item.criterion === criterion ? { ...item, score: newScore } : item
    );
    const { newOverall, newGrade } = recalculateScores(updatedReport);
    setEditableResult(prev => ({
      ...prev,
      report: updatedReport,
      overallScore: parseFloat(newOverall.toFixed(1)),
      finalChileanGrade: newGrade,
    }));
  };

  const handleFeedbackChange = (criterion: string, newFeedback: string) => {
    const updatedReport = editableResult.report.map(item =>
      item.criterion === criterion ? { ...item, feedback: newFeedback } : item
    );
    setEditableResult(prev => ({ ...prev, report: updatedReport }));
  };
  
  const handleSummaryChange = (field: 'summary' | 'professionalismSummary', value: string) => {
      setEditableResult(prev => ({ ...prev, [field]: value }));
  };

  const handleDownloadJson = () => {
    const jsonString = JSON.stringify(editableResult, null, 2);
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
    const wasEditing = isEditing;
    if (wasEditing) setIsEditing(false); // Disable editing for a clean PDF capture

    setIsGeneratingPdf(true);
    await new Promise(resolve => setTimeout(resolve, 100)); // Allow DOM to update
    await generatePdf('evaluation-report-content', repoName);
    setIsGeneratingPdf(false);

    if (wasEditing) setIsEditing(true); // Restore editing mode if it was active
  };

  const { overallScore, summary, professionalismSummary, report, finalChileanGrade } = editableResult;

  return (
    <div className="mt-8 animate-fade-in">
      <div id="evaluation-report-content" className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
        
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-6 border-b border-gray-700">
          <div className='flex-1'>
             <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Reporte de Evaluación</h2>
                  <p className="text-gray-400">Análisis del repositorio: <span className="font-semibold text-cyan-400">{repoName}</span></p>
                </div>
                <div className="flex flex-shrink-0 gap-3 items-center" id="report-actions">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`inline-flex items-center justify-center gap-2 px-3 py-2 border rounded-md shadow-sm text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors ${isEditing ? 'bg-cyan-600 hover:bg-cyan-700 border-transparent text-white' : 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-300'}`}
                        title={isEditing ? 'Guardar Cambios' : 'Habilitar Edición'}
                    >
                        <PencilIcon className="w-4 h-4" />
                        <span>{isEditing ? 'Finalizar Edición' : 'Editar'}</span>
                    </button>
                    <button
                        onClick={handleDownloadPdf}
                        disabled={isGeneratingPdf}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-600 rounded-md shadow-sm text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-wait"
                        title="Descargar reporte en PDF"
                      >
                        <DownloadIcon className="w-4 h-4" />
                        <span>PDF</span>
                    </button>
                    <button
                        onClick={handleDownloadJson}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-600 rounded-md shadow-sm text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
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
              {isEditing ? (
                  <textarea
                    value={summary}
                    onChange={(e) => handleSummaryChange('summary', e.target.value)}
                    rows={6}
                    className="w-full bg-gray-900/80 p-2 rounded-md border border-gray-600 focus:border-cyan-500 focus:ring-cyan-500 focus:outline-none transition-colors font-sans text-sm text-gray-300 not-prose"
                  />
              ) : (
                <FeedbackRenderer text={summary} />
              )}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Análisis de Profesionalismo y Buenas Prácticas</h3>
            <div className="prose prose-invert prose-p:text-gray-300 bg-black/20 p-4 rounded-md">
              {isEditing ? (
                  <textarea
                    value={professionalismSummary}
                    onChange={(e) => handleSummaryChange('professionalismSummary', e.target.value)}
                    rows={6}
                    className="w-full bg-gray-900/80 p-2 rounded-md border border-gray-600 focus:border-cyan-500 focus:ring-cyan-500 focus:outline-none transition-colors font-sans text-sm text-gray-300 not-prose"
                  />
              ) : (
                <FeedbackRenderer text={professionalismSummary} />
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Desglose por Criterio</h3>
          <div className="space-y-4">
            {report.map((item) => (
              <RubricItem 
                key={item.criterion} 
                item={item}
                isEditing={isEditing}
                onScoreChange={(newScore) => handleScoreChange(item.criterion, newScore)}
                onFeedbackChange={(newFeedback) => handleFeedbackChange(item.criterion, newFeedback)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};