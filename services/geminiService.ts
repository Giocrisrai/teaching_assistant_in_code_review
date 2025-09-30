// FIX: Implement Gemini API call for project evaluation.
import { GoogleGenAI, Type } from "@google/genai";
import type { EvaluationResult } from '../types';

// Per guidelines, initialize with API key from environment variables.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

// Define the JSON schema for the model's response, matching the EvaluationResult type.
const responseSchema = {
    type: Type.OBJECT,
    properties: {
        overallScore: { 
            type: Type.NUMBER, 
            description: "Puntaje general del proyecto de 0 a 100, calculado como el promedio ponderado de los criterios de la rúbrica." 
        },
        summary: { 
            type: Type.STRING, 
            description: "Resumen detallado y objetivo de la evaluación general del proyecto, destacando fortalezas y debilidades." 
        },
        professionalismSummary: { 
            type: Type.STRING, 
            description: "Análisis específico sobre profesionalismo, buenas prácticas, estructura de carpetas, y seguridad (ej. presencia de archivos .env)." 
        },
        report: {
            type: Type.ARRAY,
            description: "Un arreglo de objetos, donde cada objeto representa la evaluación de un criterio de la rúbrica.",
            items: {
                type: Type.OBJECT,
                properties: {
                    criterion: { type: Type.STRING, description: "El nombre exacto del criterio evaluado de la rúbrica." },
                    score: { type: Type.NUMBER, description: "Puntaje de 0 a 100 para este criterio." },
                    feedback: { type: Type.STRING, description: "Feedback detallado, constructivo y específico para este criterio, con ejemplos del código si es posible." }
                },
                required: ["criterion", "score", "feedback"]
            }
        },
        finalChileanGrade: { 
            type: Type.NUMBER, 
            description: "La nota final convertida a la escala chilena de 1.0 a 7.0. Calculada como (overallScore / 100) * 6.0 + 1.0."
        }
    },
    required: ["overallScore", "summary", "professionalismSummary", "report", "finalChileanGrade"]
};


/**
 * Sends the project context and rubric to the Gemini API for evaluation.
 * @param projectContext - A string containing all the relevant file paths and their content.
 * @param rubric - The evaluation rubric as a string.
 * @returns A promise that resolves to an EvaluationResult object.
 */
export async function evaluateProject(projectContext: string, rubric: string): Promise<EvaluationResult> {
  const prompt = `
    Eres un Profesor Asistente Senior (Ayudante Principal) de una carrera de Ingeniería Informática. Tu rol es evaluar el proyecto de un estudiante de tercer año. Sé riguroso y justo, pero tu objetivo principal es **educativo**.

    **Instrucciones Clave:**
    1.  **Rol de Mentor:** Tu tono debe ser constructivo y de mentoría. No solo señales los errores, explica **por qué** son problemáticos desde la perspectiva de la ingeniería de software y sugiere **cómo** se podrían mejorar, citando conceptos que un estudiante de este nivel debería conocer (ej. 'Esto podría mejorarse aplicando el Principio de Responsabilidad Única de SOLID...', 'Una buena práctica aquí sería usar un diccionario para evitar ifs anidados...').
    2.  **Analiza el Contexto:** Revisa la lista de archivos y el contenido de cada uno para entender la implementación del proyecto. Presta especial atención a la ALERTA DE SEGURIDAD si aparece.
    3.  **Analiza la Estructura del Directorio:** Basado en la 'Lista completa de archivos en el proyecto', evalúa si la estructura de carpetas sigue las convenciones comunes. Menciona las desviaciones significativas y sugiere mejoras.
    4.  **Aplica la Rúbrica (Calibrada):** Evalúa el proyecto criterio por criterio según la rúbrica. Recuerda que estás evaluando a un estudiante, no a un ingeniero senior. Un código que funciona, está razonablemente organizado y cumple los requisitos debe recibir una buena calificación, reservando la excelencia para quienes demuestran un dominio superior.
    5.  **Puntajes:** Asigna un puntaje de 0 a 100 para CADA criterio.
    6.  **Feedback Detallado:** Para cada criterio, proporciona un feedback específico y bien fundamentado en markdown. Cita fragmentos de código o nombres de archivo para ilustrar tus puntos. Reconoce también los aciertos.
    7.  **Calcula el Puntaje General:** El puntaje general debe ser el promedio ponderado de los puntajes de los criterios, basado en los porcentajes indicados en la rúbrica.
    8.  **Convierte a Nota Chilena:** Convierte el puntaje general (0-100) a la escala de notas de Chile (1.0 a 7.0) usando la fórmula: \`Nota = (Puntaje / 100) * 6.0 + 1.0\`. Redondea a un decimal.
    9.  **Resumen General y Profesionalismo:** Escribe los resúmenes solicitados en markdown.
    10. **Formato de Salida:** Debes responder ÚNICAMENTE con un objeto JSON que siga el esquema proporcionado. No incluyas texto antes o después del JSON, ni uses markdown de bloque de código (como \`\`\`json).

    --- INICIO DE LA RÚBRICA DE EVALUACIÓN ---
    ${rubric}
    --- FIN DE LA RÚBRICA DE EVALUACIÓN ---

    --- INICIO DEL CONTEXTO DEL PROYECTO (ARCHIVOS Y CONTENIDO) ---
    ${projectContext}
    --- FIN DEL CONTEXTO DEL PROYECTO ---

    Ahora, proporciona tu evaluación completa en el formato JSON solicitado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Lower temperature for more consistent and objective evaluations.
      },
    });
    
    // Per guidelines, access text directly.
    const resultText = response.text;
    if (!resultText) {
        throw new Error("La respuesta de la IA está vacía.");
    }
    
    const result: EvaluationResult = JSON.parse(resultText);
    return result;

  } catch (error: any) {
    console.error("Error al llamar a la API de Gemini o al parsear la respuesta:", error);
    let errorMessage = "Ocurrió un error al comunicarse con la IA de Gemini. Revisa la consola para más detalles.";
    if (error instanceof SyntaxError) {
        errorMessage = "La respuesta de la IA no es un JSON válido. Esto puede ocurrir por filtros de seguridad o un problema en el modelo. Por favor, intenta de nuevo.";
    } else if (error.message) {
        errorMessage = `Error de la API: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
}