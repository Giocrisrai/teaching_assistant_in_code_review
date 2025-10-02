import type { GradingScale } from '../types';

/**
 * Calculates the final Chilean grade (1.0 to 7.0) based on a score (0 to 100)
 * and a specific grading scale demand level.
 *
 * @param score The student's score, from 0 to 100.
 * @param scale The grading scale to use: 60 for 60%, 50 for 50%, or 0 for direct proportional.
 * @returns The calculated grade, rounded to one decimal place.
 */
export function calculateChileanGrade(score: number, scale: GradingScale): number {
  const clampedScore = Math.max(0, Math.min(100, score));

  let grade: number;

  if (scale === 0) {
    // Direct proportional scale
    grade = (clampedScore / 100) * 6 + 1;
  } else {
    // Linear scale with demand level
    const approvalScore = scale;
    const maxScore = 100;

    if (clampedScore < approvalScore) {
      // Formula for the "fail" range (1.0 to 3.9)
      // Line passing through (0, 1.0) and (approvalScore, 4.0)
      const slope = (4.0 - 1.0) / approvalScore;
      grade = 1.0 + slope * clampedScore;
    } else {
      // Formula for the "pass" range (4.0 to 7.0)
      // Line passing through (approvalScore, 4.0) and (maxScore, 7.0)
      const slope = (7.0 - 4.0) / (maxScore - approvalScore);
      grade = 4.0 + slope * (clampedScore - approvalScore);
    }
  }

  // Clamp the final grade to be within the 1.0 to 7.0 range and round to one decimal place.
  const finalGrade = Math.min(7.0, Math.max(1.0, grade));
  return Math.round(finalGrade * 10) / 10;
}