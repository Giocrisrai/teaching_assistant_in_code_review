// FIX: Implement the RubricItem component to display a single criterion's evaluation.
import React from 'react';
import type { EvaluationItem } from '../types';
import { getScoreColorClass } from '../utils/colors';
import { FeedbackRenderer } from './FeedbackRenderer';

interface RubricItemProps {
  item: EvaluationItem;
  isEditing: boolean;
  onScoreChange: (newScore: number) => void;
  onFeedbackChange: (newFeedback: string) => void;
}

export const RubricItem: React.FC<RubricItemProps> = ({ item, isEditing, onScoreChange, onFeedbackChange }) => {
  const scoreColor = getScoreColorClass(item.score);

  const handleScoreInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newScore = parseInt(e.target.value, 10);
    if (isNaN(newScore)) newScore = 0;
    // Clamp the score between 0 and 100
    newScore = Math.max(0, Math.min(100, newScore));
    onScoreChange(newScore);
  };
  
  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFeedbackChange(e.target.value);
  };


  return (
    <div className={`bg-gray-900/70 border border-gray-700 rounded-lg p-4 transition-all duration-300 ${isEditing ? 'ring-2 ring-cyan-500/50' : 'hover:shadow-lg'}`}>
      <div className="flex justify-between items-start gap-4">
        <h4 className="text-lg font-semibold text-gray-100 flex-1">{item.criterion}</h4>
        <div className="flex-shrink-0 flex items-center">
          {isEditing ? (
             <input
              type="number"
              value={item.score}
              onChange={handleScoreInputChange}
              min="0"
              max="100"
              className={`text-2xl font-bold ${scoreColor} bg-transparent w-20 text-right border-b-2 border-gray-600 focus:border-cyan-500 focus:outline-none transition-colors p-0`}
            />
          ) : (
             <span className={`text-2xl font-bold ${scoreColor}`}>{item.score}</span>
          )}
          <span className="text-sm text-gray-500 ml-1"> / 100</span>
        </div>
      </div>
      <div className="mt-3">
         {isEditing ? (
            <textarea
                value={item.feedback}
                onChange={handleFeedbackChange}
                rows={6}
                className="w-full bg-gray-900/80 p-2 rounded-md border border-gray-600 focus:border-cyan-500 focus:ring-cyan-500 focus:outline-none transition-colors font-sans text-sm text-gray-300"
            />
         ) : (
            <div className="prose prose-sm prose-invert max-w-none prose-p:text-gray-300 prose-ul:text-gray-300 prose-li:marker:text-cyan-400">
                <FeedbackRenderer text={item.feedback} />
            </div>
         )}
      </div>
    </div>
  );
};