// FIX: Implement the EvaluationReport component to display analysis results.
import React from 'react';
import type { EvaluationResult, EvaluationItem, GradingScale } from '../types';
import { ScoreDonut } from './ScoreDonut';
import { RubricItem } from './RubricItem';
import { FeedbackRenderer } from './FeedbackRenderer';
import { JsonIcon, DownloadIcon, PencilIcon } from './icons';
import { generatePdf } from '../utils/pdfGenerator';
import { calculateChileanGrade } from '../utils/gradingScales';


interface EvaluationReportProps {
  result: EvaluationResult;
  repoName: string;
}

export const EvaluationReport: React.FC<EvaluationReportProps> = ({ result, repoName }) => {
  // FIX: Use React.useState to resolve "Cannot find name 'useState'" error.
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [editableResult, setEditableResult] = React.useState<EvaluationResult>(result);
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState<boolean>(false);
  const [gradingScale, setGradingScale] = React.useState<GradingScale>(60); // Default to 60%

  // When the original result prop changes (e.g., a new analysis), reset the editable state.
  // FIX: Use React.useEffect to resolve "Cannot find name 'useEffect'" error.
  React.useEffect(() => {
    // Recalculate grade with the default scale upon receiving a new result
    const { newGrade } = recalculateScores(result.report, result.overallScore, 60);
    setEditableResult({ ...result, finalChileanGrade: newGrade });
    setGradingScale(60);
    setIsEditing(false);
  }, [result]);
  
  const recalculateScores = (updatedReport: EvaluationItem[], overallScore: number, scale: GradingScale): { newOverall: number; newGrade: number } => {
      if (updatedReport.length === 0) return { newOverall: 0, newGrade: 1.0 };
      
      let newOverall = overallScore;
      // If the report items are the source of truth, recalculate overall score
      if (updatedReport.length > 0) {
        const totalScore = updatedReport.reduce((acc, item) => acc + item.score, 0);
        newOverall = totalScore / updatedReport.length;
      }

      const newGrade = calculateChileanGrade(newOverall, scale);
      return { newOverall, newGrade };
  };

  React.useEffect(() => {
    // Recalculate grade whenever the scale changes
    const { newGrade } = recalculateScores(editableResult.report, editableResult.overallScore, gradingScale);
    setEditableResult(prev => ({ ...prev, finalChileanGrade: newGrade }));
  }, [gradingScale]);

  const handleScoreChange = (criterion: string, newScore: number) => {
    const updatedReport = editableResult.report.map(item =>
      item.criterion === criterion ? { ...item, score: newScore } : item
    );
    const totalScore = updatedReport.reduce((acc, item) => acc + item.score, 0);
    const newOverall = totalScore / updatedReport.length;

    const { newGrade } = recalculateScores(updatedReport, newOverall, gradingScale);
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

            <div className="mt-4">
              <span className="text-lg">Nota Final: </span>
              <span className="font-bold text-2xl text-white">{finalChileanGrade.toFixed(1)}</span>
              <span className="text-gray-400 ml-2">(Puntaje: {overallScore.toFixed(1)} / 100)</span>
            </div>
             <GradingScaleSelector scale={gradingScale} setScale={setGradingScale} />
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

const GradingScaleSelector: React.FC<{scale: GradingScale, setScale: (scale: GradingScale) => void}> = ({ scale, setScale }) => {
  const descriptions = {
    60: "Con 60% de exigencia, se necesita un puntaje de 60 para obtener la nota 4.0.",
    50: "Con 50% de exigencia, se necesita un puntaje de 50 para obtener la nota 4.0.",
    0: "Escala proporcional directa, donde el puntaje 0 es un 1.0 y el 100 es un 7.0."
  };

  return (
    <div className="mt-3">
        <label htmlFor="grading-scale" className="block text-sm font-medium text-gray-400">
            Escala de Calificación
        </label>
        <select
            id="grading-scale"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value) as GradingScale)}
            className="mt-1 block w-full sm:w-auto pl-3 pr-10 py-1.5 text-base border-gray-600 bg-gray-900/50 text-gray-200 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md"
        >
            <option value="60">60% de Exigencia</option>
            <option value="50">50% de Exigencia</option>
            <option value="0">Proporcional Directa</option>
        </select>
        <p className="mt-2 text-xs text-gray-500">{descriptions[scale]}</p>
    </div>
  );
}