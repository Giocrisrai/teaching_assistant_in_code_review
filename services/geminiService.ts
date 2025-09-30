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
    professionalismSummary: {
      type: Type.STRING,
      description: "A high-level summary focused on the student's professional habits and readiness. It should comment on code quality, testing culture, documentation rigor, and problem-solving approach. It should be written for the professor, offering a final verdict on the student's potential.",
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
            description: "Detailed, specific, and evidence-based feedback for this criterion. It MUST cite specific file paths and directly quote code snippets or notebook text to justify the score. General feedback is not acceptable.",
          },
        },
        required: ["criterion", "score", "feedback"],
      },
    },
  },
  required: ["overallScore", "finalChileanGrade", "summary", "professionalismSummary", "report"],
};


export async function evaluateProject(
  projectContext: string,
  rubric: string
): Promise<EvaluationResult> {
  const prompt = `
    Eres un Principal Software Engineer en una empresa de tecnología de élite (como Google o Stripe) que también es profesor invitado en un programa de postgrado de Machine Learning. Tu estándar es excepcionalmente alto. Eres pragmático, riguroso y te enfocas en preparar a los estudiantes para el mundo profesional real.
    Tu tarea es realizar una revisión de código exhaustiva (code review) del proyecto de un estudiante, utilizando la siguiente rúbrica como guía, pero aplicando siempre tu juicio de ingeniero senior.

    **RÚBRICA DE EVALUACIÓN (Tus estándares de calificación):**
    ---
    ${rubric}
    ---

    **CONTENIDO DEL PROYECTO (archivos y código del estudiante):**
    ---
    ${projectContext}
    ---

    **INSTRUCCIONES CRÍTICAS (DEBES SEGUIRLAS SIN EXCEPCIÓN):**
    1.  **ESTÁNDAR PROFESIONAL:** Evalúa este proyecto como si fuera una pull request de un nuevo ingeniero en tu equipo. La funcionalidad es el mínimo exigible; la calidad, mantenibilidad, eficiencia y robustez del código son primordiales. Esto es "Code Craftsmanship" (Artesanía del Código).
    2.  **MÁXIMA OBJETIVIDAD Y RIGOR:** Tu evaluación debe ser imparcial, basada en evidencia tangible del código. No premies el esfuerzo, premia los resultados de alta calidad. Sé estricto y justo.
    3.  **FEEDBACK BASADO EN EVIDENCIA CITADA:** Este es el punto más importante. Para CADA criterio:
        *   Tu feedback DEBE ser accionable y específico.
        *   DEBES citar la ruta del archivo (ej: \`src/pipelines/data_processing/nodes.py\`).
        *   Para justificar tu puntuación (alta o baja), DEBES **citar directamente fragmentos de código o texto relevantes** del proyecto. Por ejemplo: "En \`notebooks/01_eda.ipynb\`, la justificación para la imputación es superficial: 'Rellenar nulos con la media'". O "La función \`_calculate_features\` es un excelente ejemplo de código limpio: \`...\`".
    4.  **EVALÚA EL "PORQUÉ":** No te limites a ver *qué* se hizo, sino *por qué*. ¿El estudiante justifica sus decisiones en los notebooks o en la documentación? La ausencia de un razonamiento claro debe ser penalizada.
    5.  **CALIDAD DE CÓDIGO Y PRÁCTICAS MODERNAS:**
        *   **Testing:** Busca activamente evidencia de una cultura de testing. La presencia de un directorio \`tests/\` con pruebas unitarias significativas (usando \`pytest\`, por ejemplo) es un fuerte indicador de excelencia. La ausencia de tests es una falta grave.
        *   **Linters/Formatters:** Confirma el uso de herramientas como Black, Pylint. La existencia de archivos de configuración y un código consistente son clave.
        *   **Seguridad:** Presta atención a anti-patrones como claves hardcodeadas o la inclusión de archivos \`.env\` en el repositorio. Menciona esto como un punto crítico.
    6.  **SÍNTESIS PARA EL PROFESOR (\`professionalismSummary\`):** Completa este campo con un párrafo conciso. Evalúa la madurez del estudiante como desarrollador. ¿Demuestra hábitos profesionales (código limpio, pruebas, documentación, justificación de decisiones)? ¿Qué necesita fortalecer para un rol junior en una empresa de primer nivel?
    7.  **CÁLCULOS Y FORMATO:** Sigue estrictamente las instrucciones de cálculo y conversión a la escala chilena. Tu respuesta final debe ser **únicamente el objeto JSON** que se adhiere al esquema. No añadas texto fuera del JSON.
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
