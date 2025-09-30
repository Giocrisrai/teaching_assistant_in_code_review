import React from 'react';
import type { EvaluationItem } from '../types';
import { getScoreColorStyles } from '../utils';

interface RubricItemProps {
  item: EvaluationItem;
}

export const RubricItem: React.FC<RubricItemProps> = ({ item }) => {
  const { bg, text } = getScoreColorStyles(item.score);

  return (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-200 flex-1 pr-4">{item.criterion}</h4>
        <span className={`font-bold text-lg ${text}`}>{item.score}/100</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
        <div
          className={`${bg} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${item.score}%` }}
        ></div>
      </div>
      <div>
        <h5 className="text-sm font-semibold text-gray-400 mb-1">Feedback Detallado:</h5>
        <p className="text-gray-300 text-sm whitespace-pre-wrap font-mono bg-black/20 p-3 rounded-md">{item.feedback}</p>
      </div>
    </div>
  );
};