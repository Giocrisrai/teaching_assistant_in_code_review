import React from 'react';
import { getScoreHexColor, getScoreColorClass } from '../utils';

interface ScoreDonutProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export const ScoreDonut: React.FC<ScoreDonutProps> = ({
  score,
  size = 120,
  strokeWidth = 10,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = getScoreHexColor(score);
  const textColorClass = getScoreColorClass(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Círculo de fondo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="#374151" // gray-700
          fill="transparent"
        />
        {/* Círculo de progreso */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: 'stroke-dashoffset 1s ease-in-out',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${textColorClass}`}>{score.toFixed(1)}</span>
        <span className="text-xs text-gray-400">/ 100</span>
      </div>
    </div>
  );
};