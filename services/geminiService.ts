import { GoogleGenAI, Type } from "@google/genai";
import type { GitHubFile, EvaluationResult } from '../types';

// FIX: Implement the Gemini service to communicate with the Google GenAI API.
// This file contains the core logic for analyzing repository contents against a rubric.

// Per instructions, initialize the client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for the JSON output from the Gemini model, matching the EvaluationResult type.
const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.NUMBER,
      description: 'Puntuación general de 0 a 100, calculada como el promedio de las puntuaciones de todos los criterios.',
    },
    summary: {
      type: Type.STRING,
      description: 'Resumen general detallado de la evaluación, destacando fortalezas y debilidades clave. Debe estar en formato Markdown.',
    },
    professionalismSummary: {
        type: Type.STRING,
        description: 'Análisis específico sobre profesionalismo, buenas prácticas, reproducibilidad y seguridad. Debe estar en formato Markdown.'
    },
    report: {
      type: Type.ARRAY,
      description: 'Desglose de la evaluación por cada criterio de la rúbrica.',
      items: {
        type: Type.OBJECT,
        properties: {
          criterion: {
            type: Type.STRING,
            description: 'Nombre del criterio evaluado, extraído exactamente de la rúbrica.',
          },
          score: {
            type: Type.NUMBER,
            description: 'Puntuación asignada de 0 a 100 para este criterio específico.',
          },
          feedback: {
            type: Type.STRING,
            description: 'Feedback detallado y constructivo para este criterio, explicando la puntuación asignada. Debe estar en formato Markdown y mencionar archivos o rutas específicas (ej. `src/pipelines/data_processing/nodes.py`) cuando sea relevante para justificar el feedback.',
          },
        },
        required: ['criterion', 'score', 'feedback'],
      },
    },
    finalChileanGrade: {
      type: Type.NUMBER,
      description: 'La nota final en escala chilena de 1.0 a 7.0. Se calcula como: `((overallScore / 100) * 6) + 1`. Debe redondearse a un decimal.'
    }
  },
  required: ['overallScore', 'summary', 'professionalismSummary', 'report', 'finalChileanGrade'],
};


/**
 * Sends repository files and a rubric to the Gemini API for evaluation.
 * @param files - An array of files from the GitHub repository.
 * @param rubric - The evaluation rubric as a string.
 * @param envFileWarning - A warning string if a .env file was found.
 * @returns A promise that resolves to an EvaluationResult object.
 */
export async function evaluateRepoWithGemini(
  files: GitHubFile[],
  rubric: string,
  envFileWarning: string
): Promise<EvaluationResult> {
  const fileContents = files
    .map(file => `
--- INICIO ARCHIVO: ${file.path} ---
\`\`\`
${file.content}
\`\`\`
--- FIN ARCHIVO: ${file.path} ---
`)
    .join('\n');

  const systemInstruction = `Eres un experto en ingeniería de software y ciencia de datos, actuando como un asistente de profesor riguroso, justo y constructivo para evaluar proyectos universitarios.

Tu tarea es analizar el código y los archivos de un repositorio y evaluarlo estrictamente según la rúbrica proporcionada.

**Instrucciones Clave:**
1.  **Rúbrica Estricta:** Basa TODA tu evaluación en los criterios y puntajes definidos en la rúbrica. No inventes criterios.
2.  **Feedback Específico:** Tu feedback debe ser concreto, mencionando archivos y rutas (ej. \`conf/base/parameters.yml\`) o funciones específicas para justificar tus puntos. En lugar de "el código no es modular", di "la función 'process_data' en 'src/nodes.py' es muy larga y viola el Principio de Responsabilidad Única".
3.  **Justificación Cuantitativa:** Justifica cada puntaje. Si asignas 80/100, explica qué faltó para alcanzar el 100.
4.  **Formato JSON Obligatorio:** Debes devolver SIEMPRE un único objeto JSON que se ajuste al esquema proporcionado. No incluyas texto, markdown o explicaciones fuera de este objeto JSON.
5.  **Cálculo de Puntajes:**
    -   El 'score' para cada criterio debe estar entre 0 y 100.
    -   El 'overallScore' debe ser el promedio exacto de los 'score' de todos los criterios del 'report'.
    -   La 'finalChileanGrade' se calcula como \`((overallScore / 100) * 6) + 1\`, redondeado a un decimal.
6.  **Análisis de Profesionalismo:** Presta especial atención a la reproducibilidad (\`requirements.txt\`), calidad del código (PEP8), configuración (\`parameters.yml\`), y seguridad. El \`professionalismSummary\` debe enfocarse en estos aspectos transversales.
7.  **Alerta de Seguridad:** Si se proporciona una alerta de seguridad (como la presencia de un archivo \`.env\`), DEBES mencionarla de forma prominente y crítica en el \`professionalismSummary\` y en el feedback del criterio de 'Buenas Prácticas', aplicando una penalización severa en el puntaje de ese criterio.
`;

  const prompt = `
**Rúbrica de Evaluación:**
---
${rubric}
---

${envFileWarning}

**Contenido del Repositorio:**
---
${fileContents}
---

Por favor, evalúa el repositorio basándote en la rúbrica y el contenido de los archivos. Genera el reporte completo en el formato JSON especificado.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: evaluationSchema,
        temperature: 0.2, // Lower temperature for more consistent and factual evaluation
      },
    });

    const jsonText = response.text.trim();
    // The model is instructed to return valid JSON matching the schema.
    const result: EvaluationResult = JSON.parse(jsonText);
    
    // As a safeguard, recalculate scores to ensure consistency, in case the model makes a math error.
    if (result.report && result.report.length > 0) {
      const totalScore = result.report.reduce((acc, item) => acc + item.score, 0);
      const calculatedOverallScore = totalScore / result.report.length;
      result.overallScore = parseFloat(calculatedOverallScore.toFixed(1));

      const calculatedGrade = (result.overallScore / 100) * 6 + 1;
      result.finalChileanGrade = parseFloat(Math.min(7.0, Math.max(1.0, calculatedGrade)).toFixed(1));
    }

    return result;

  } catch (error) {
    console.error('Error al llamar a la API de Gemini:', error);
    let errorMessage = 'No se pudo completar la evaluación debido a un error con el servicio de IA.';
    if (error instanceof Error) {
        errorMessage += ` Detalles: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
}
