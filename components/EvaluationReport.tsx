import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { EvaluationResult } from '../types';
import { ScoreDonut } from './ScoreDonut';
import { RubricItem } from './RubricItem';
import { FeedbackRenderer } from './FeedbackRenderer';
import { calculateChileanGrade } from '../utils/gradingScales';
import { generateMarkdownReport, downloadFile } from '../utils/markdownGenerator';
import { generatePdfReport } from '../utils/pdfGenerator';
import { PencilSquareIcon, SaveIcon, DownloadIcon, MarkdownIcon, XIcon } from './icons';
import { getScoreHexColor } from '../utils/colors';

interface EvaluationReportProps {
  result: EvaluationResult;
  repoName: string;
}

export const EvaluationReport: React.FC<EvaluationReportProps> = ({ result, repoName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableResult, setEditableResult] = useState<EvaluationResult>(result);

  useEffect(() => {
    // Sync state if the original result prop changes
    setEditableResult(result);
  }, [result]);

  const calculatedScores = useMemo(() => {
    if (!editableResult.report || editableResult.report.length === 0) {
      return { overallScore: 0, finalChileanGrade: 1.0 };
    }
    const totalScore = editableResult.report.reduce((acc, item) => acc + item.score, 0);
    const overallScore = totalScore / editableResult.report.length;
    // Use the standard 60% demand scale by default
    const finalChileanGrade = calculateChileanGrade(overallScore, 60);
    return { overallScore, finalChileanGrade };
  }, [editableResult.report]);

  const handleScoreChange = (index: number, newScore: number) => {
    const newReport = [...editableResult.report];
    newReport[index] = { ...newReport[index], score: newScore };
    setEditableResult({ ...editableResult, report: newReport });
  };

  const handleFeedbackChange = (index: number, newFeedback: string) => {
    const newReport = [...editableResult.report];
    newReport[index] = { ...newReport[index], feedback: newFeedback };
    setEditableResult({ ...editableResult, report: newReport });
  };
  
  const handleSummaryChange = (field: 'summary' | 'professionalismSummary', value: string) => {
    setEditableResult({ ...editableResult, [field]: value });
  };

  const handleSaveChanges = () => {
     setEditableResult(prev => ({
        ...prev,
        overallScore: calculatedScores.overallScore,
        finalChileanGrade: calculatedScores.finalChileanGrade,
     }));
    setIsEditing(false);
  };
  
  const handleCancelChanges = () => {
    setEditableResult(result); // Revert to original prop
    setIsEditing(false);
  }

  const handleDownloadMarkdown = useCallback(() => {
    const finalResult = {
        ...editableResult,
        overallScore: calculatedScores.overallScore,
        finalChileanGrade: calculatedScores.finalChileanGrade,
    };
    const markdownContent = generateMarkdownReport(finalResult, repoName);
    downloadFile(`Evaluacion-${repoName}.md`, markdownContent);
  }, [editableResult, repoName, calculatedScores]);

  const handleDownloadPdf = useCallback(async () => {
    const finalResult = {
        ...editableResult,
        overallScore: calculatedScores.overallScore,
        finalChileanGrade: calculatedScores.finalChileanGrade,
    };
    await generatePdfReport(finalResult, repoName);
  }, [editableResult, repoName, calculatedScores]);

  const scoreGlowColor = getScoreHexColor(calculatedScores.overallScore);

  return (
    <div className="mt-12">
      <div className="bg-gray-900/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-gray-700/80">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-gray-700 pb-6 mb-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Reporte de Evaluación</h2>
                <p className="text-gray-400">Repositorio: <span className="font-semibold text-cyan-400">{repoName}</span></p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                {isEditing ? (
                     <>
                        <button onClick={handleSaveChanges} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors">
                            <SaveIcon className="w-4 h-4" /> Guardar Cambios
                        </button>
                        <button onClick={handleCancelChanges} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-500 rounded-md transition-colors">
                            <XIcon className="w-4 h-4" /> Cancelar
                        </button>
                    </>
                ) : (
                    <>
                        <ActionButton onClick={() => setIsEditing(true)} icon={<PencilSquareIcon className="w-4 h-4" />} label="Editar" />
                        <ActionButton onClick={handleDownloadMarkdown} icon={<MarkdownIcon className="w-4 h-4" />} label=".md" />
                        <ActionButton onClick={handleDownloadPdf} icon={<DownloadIcon className="w-4 h-4" />} label=".pdf" />
                    </>
                )}
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div 
              className="md:col-span-2 flex flex-col items-center justify-center bg-gray-900/50 p-6 rounded-xl relative overflow-hidden border border-gray-700"
              style={{ '--glow-color': scoreGlowColor } as React.CSSProperties}
            >
              <div 
                className="absolute -inset-2 rounded-xl opacity-20 blur-xl transition-colors duration-1000"
                style={{ background: `radial-gradient(circle, var(--glow-color) 0%, transparent 70%)` }}
              ></div>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Puntaje General</h3>
                <ScoreDonut score={calculatedScores.overallScore} />
                <div className="mt-4 text-center">
                    <p className="text-gray-400">Nota Final (Escala Chilena)</p>
                    <p className="text-5xl font-bold text-white tracking-tight">{calculatedScores.finalChileanGrade.toFixed(1)}</p>
                </div>
            </div>

            <div className="md:col-span-3 space-y-4">
                <SummaryCard title="Resumen de la Evaluación" content={editableResult.summary} isEditing={isEditing} onChange={(val) => handleSummaryChange('summary', val)} />
                <SummaryCard title="Profesionalismo y Buenas Prácticas" content={editableResult.professionalismSummary} isEditing={isEditing} onChange={(val) => handleSummaryChange('professionalismSummary', val)} />
            </div>
        </div>
      </div>
      
      <div className="mt-10">
        <h3 className="text-2xl font-bold text-white mb-6">Desglose por Criterio</h3>
        <div className="space-y-4">
          {editableResult.report.map((item, index) => (
            <RubricItem
              key={index}
              item={item}
              isEditing={isEditing}
              onScoreChange={(newScore) => handleScoreChange(index, newScore)}
              onFeedbackChange={(newFeedback) => handleFeedbackChange(index, newFeedback)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ActionButton: React.FC<{onClick: () => void; icon: React.ReactNode; label: string}> = ({ onClick, icon, label }) => (
    <button onClick={onClick} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-200 bg-gray-700/50 hover:bg-gray-700 rounded-md transition-colors border border-gray-600">
        {icon} {label}
    </button>
);

const SummaryCard: React.FC<{title: string; content: string; isEditing: boolean; onChange: (value: string) => void}> = ({ title, content, isEditing, onChange }) => {
    return (
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/70">
            <h4 className="font-semibold text-gray-200 mb-2">{title}</h4>
            {isEditing ? (
                <textarea
                    value={content}
                    onChange={(e) => onChange(e.target.value)}
                    rows={8}
                    className="w-full bg-gray-800/80 p-2 rounded-md border border-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none transition-colors font-sans text-sm text-gray-300"
                />
            ) : (
                <div className="prose prose-sm prose-invert max-w-none prose-p:text-gray-300">
                    <FeedbackRenderer text={content} />
                </div>
            )}
        </div>
    );
};