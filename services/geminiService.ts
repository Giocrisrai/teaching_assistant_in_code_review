import { GoogleGenAI, Type } from "@google/genai";
import type { EvaluationResult } from '../types';

// FIX: Initialize GoogleGenAI with the API key from environment variables as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.NUMBER,
      description: "The final weighted average score for the project, from 0 to 100.",
    },
    finalChileanGrade: {
      type: Type.NUMBER,
      description: "The final score converted to the Chilean grading scale (1.0 to 7.0). Calculated as (overallScore / 100) * 6 + 1, rounded to one decimal place.",
    },
    summary: {
      type: Type.STRING,
      description: "A concise, high-level summary of the project's strengths and weaknesses, written with a professional and rigorous tone.",
    },
    report: {
      type: Type.ARRAY,
      description: "An array of evaluations for each specific criterion from the rubric.",
      items: {
        type: Type.OBJECT,
        properties: {
          criterion: {
            type: Type.STRING,
            description: "The name of the criterion being evaluated (e.g., 'Project Structure and Kedro Configuration').",
          },
          score: {
            type: Type.NUMBER,
            description: "The score for this criterion, from 0 to 100. This score must be rigorously justified.",
          },
          feedback: {
            type: Type.STRING,
            description: "Detailed, specific, and evidence-based feedback for this criterion. It MUST cite specific file paths, code snippets, or notebook cells to justify the score. General feedback is not acceptable.",
          },
        },
        required: ["criterion", "score", "feedback"],
      },
    },
  },
  required: ["overallScore", "finalChileanGrade", "summary", "report"],
};


export async function evaluateProject(
  projectContext: string,
  rubric: string
): Promise<EvaluationResult> {
  const prompt = `
    Eres un profesor universitario de Machine Learning y un revisor de código senior, extremadamente riguroso y meticuloso.
    Tu tarea es evaluar el proyecto de un estudiante con un alto estándar de calidad, basándote en una rúbrica específica y en el contenido completo del proyecto proporcionado.

    **RÚBRICA DE EVALUACIÓN (Tus estándares de calificación):**
    ---
    ${rubric}
    ---

    **CONTENIDO DEL PROYECTO (archivos y código del estudiante):**
    ---
    ${projectContext}
    ---

    **INSTRUCCIONES CRÍTICAS (DEBES SEGUIRLAS AL PIE DE LA LETRA):**
    1.  **ACTÚA CON RIGOR:** No seas indulgente. Si el trabajo es mediocre, tu feedback y puntaje deben reflejarlo. Cumplir con lo mínimo no merece una nota alta.
    2.  **FEEDBACK BASADO EN EVIDENCIA:** Para CADA criterio, tu feedback DEBE ser específico y justificado con evidencia del código. CITA nombres de archivo (ej: \`src/proyecto_ml/pipelines/data_engineering/nodes.py\`), fragmentos de código, o describe celdas específicas de los notebooks para respaldar tu evaluación.
    3.  **PENALIZA OMISIONES:** Si un entregable requerido por la rúbrica (ej: un README completo, 3 datasets en el catálogo, docstrings, etc.) está ausente o incompleto, el puntaje para ese criterio debe ser bajo y el feedback debe señalar claramente la omisión.
    4.  **CÁLCULO DE PUNTAJE:**
        a.  Calcula un puntaje final (overallScore) como el promedio simple de los puntajes de todos los criterios (0-100).
        b.  **CONVERSIÓN DE NOTA OBLIGATORIA:** Convierte el \`overallScore\` a la escala de notas de Chile (1.0 a 7.0) usando la fórmula: \`Nota = (overallScore / 100) * 6 + 1\`. Redondea el resultado a un decimal. Asigna este valor a \`finalChileanGrade\`.
    5.  **AUTO-REVISIÓN FINAL:** Antes de generar la respuesta final, haz una pausa y revisa tu propio análisis. Pregúntate: ¿He sido suficientemente crítico? ¿Mi feedback es accionable y está respaldado por evidencia concreta? ¿La nota refleja con precisión la calidad del trabajo? Ajusta tu evaluación si es necesario para cumplir con los más altos estándares de rigurosidad.
    6.  **FORMATO DE SALIDA:** Tu respuesta final debe ser **únicamente el objeto JSON** que se adhiere estrictamente al esquema proporcionado. No incluyas texto introductorio, explicaciones adicionales ni la palabra "json".
  `;

  try {
    // FIX: Use ai.models.generateContent with the 'gemini-2.5-flash' model and configure for JSON output as per guidelines.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: evaluationSchema,
        temperature: 0.1, // Lower temperature for more deterministic and rigorous evaluation
      },
    });
    
    // FIX: Extract text from the response and parse it as JSON.
    const jsonText = response.text;
    const result = JSON.parse(jsonText);

    if (!result.report || !result.summary || typeof result.overallScore === 'undefined' || typeof result.finalChileanGrade === 'undefined') {
        throw new Error("La respuesta de la IA no tiene el formato esperado o faltan campos clave (como la nota chilena).");
    }

    return result as EvaluationResult;
  } catch (error: any) {
    console.error("Error al llamar a la API de Gemini:", error);
    if (error.message.includes("API key not valid")) {
       throw new Error("La clave de API de Gemini no es válida o no está configurada. Asegúrate de que la variable de entorno API_KEY esté correctamente establecida.");
    }
    throw new Error(`Error durante la evaluación con Gemini: ${error.message}`);
  }
}