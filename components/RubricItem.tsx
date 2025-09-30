// FIX: Implement the RubricItem component to display a single criterion's evaluation.
import React from 'react';
import type { EvaluationItem } from '../types';
import { getScoreColorClass } from '../utils/colors';
import { FeedbackRenderer } from './FeedbackRenderer';

interface RubricItemProps {
  item: EvaluationItem;
}

export const RubricItem: React.FC<RubricItemProps> = ({ item }) => {
  const scoreColor = getScoreColorClass(item.score);

  return (
    <div className="bg-gray-900/70 border border-gray-700 rounded-lg p-4 transition-shadow hover:shadow-lg">
      <div className="flex justify-between items-start gap-4">
        <h4 className="text-lg font-semibold text-gray-100 flex-1">{item.criterion}</h4>
        <div className="flex-shrink-0">
          <span className={`text-2xl font-bold ${scoreColor}`}>{item.score}</span>
          <span className="text-sm text-gray-500"> / 100</span>
        </div>
      </div>
      <div className="mt-3 prose prose-sm prose-invert max-w-none prose-p:text-gray-300 prose-ul:text-gray-300 prose-li:marker:text-cyan-400">
        <FeedbackRenderer text={item.feedback} />
      </div>
    </div>
  );
};
