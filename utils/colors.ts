/**
 * Devuelve las clases de Tailwind CSS para el color de fondo y texto según un puntaje.
 * @param score - El puntaje numérico (0-100).
 * @returns Un objeto con las clases `bg` y `text`.
 */
export const getScoreColorStyles = (score: number): { bg: string; text: string } => {
  if (score >= 80) return { bg: 'bg-green-500', text: 'text-green-300' };
  if (score >= 60) return { bg: 'bg-yellow-500', text: 'text-yellow-300' };
  if (score >= 40) return { bg: 'bg-orange-500', text: 'text-orange-300' };
  return { bg: 'bg-red-500', text: 'text-red-300' };
};

/**
 * Devuelve solo la clase de Tailwind CSS para el color de texto según un puntaje.
 * @param score - El puntaje numérico (0-100).
 * @returns La clase `text` de Tailwind.
 */
export const getScoreColorClass = (score: number): string => {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
};

/**
 * Devuelve solo el color hexadecimal según un puntaje para usar en estilos SVG.
 * @param score - El puntaje numérico (0-100).
 * @returns Una cadena con el código de color hexadecimal.
 */
export const getScoreHexColor = (score: number): string => {
    if (score >= 80) return '#4ade80'; // green-400
    if (score >= 60) return '#facc15'; // yellow-400
    if (score >= 40) return '#fb923c'; // orange-400
    return '#f87171'; // red-400
}
