import { GoogleGenAI } from "@google/genai";
import type { GitHubFile, EvaluationResult } from '../types';

// Per instructions, initialize the client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Set a character limit for each chunk to avoid oversized prompts that can cause 500 errors.
const CHUNK_SIZE_LIMIT = 150000; 

/**
 * Summarizes a chunk of code files by calling the Gemini API.
 * This is the first stage of the two-stage evaluation process.
 * @param chunk - An array of files to summarize.
 * @returns A promise that resolves to a string summary of the chunk.
 */
async function summarizeFileChunk(chunk: GitHubFile[]): Promise<string> {
    const fileContents = chunk
        .map(file => `
--- INICIO ARCHIVO: ${file.path} ---
\`\`\`
${file.content}
\`\`\`
--- FIN ARCHIVO: ${file.path} ---
`)
        .join('\n');

    const prompt = `Eres un asistente de análisis de código experto. Tu tarea es resumir el siguiente conjunto de archivos de código de un repositorio.

**Instrucciones:**
1.  **No evalúes ni califiques.** Simplemente describe el contenido y la estructura de manera objetiva.
2.  **Sé conciso pero completo.** Extrae los puntos más importantes de cada archivo: su propósito, las funciones o clases principales, y cómo se conectan con otros archivos si es evidente.
3.  **Menciona el profesionalismo.** Señala brevemente la calidad del código, como el uso de comentarios, la claridad de los nombres y el formato, pero sin asignar una puntuación.
4.  **Enfócate en la estructura.** Describe la organización general que observas en este fragmento de código.

**Archivos a resumir:**
${fileContents}

Genera un resumen técnico en formato Markdown.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.1,
            }
        });
        return response.text;
    } catch (error) {
        console.error('Error al resumir un fragmento de código:', error);
        return `Error: No se pudo generar un resumen para este fragmento de archivos.`;
    }
}


/**
 * Sends repository files and a rubric to the Gemini API for evaluation using a two-stage approach.
 * @param files - An array of files from the GitHub repository.
 * @param rubric - The evaluation rubric as a string.
 * @param envFileWarning - A warning string if a .env file was found.
 * @param onProgress - A callback to update the loading message in the UI.
 * @returns A promise that resolves to an EvaluationResult object.
 */
export async function evaluateRepoWithGemini(
  files: GitHubFile[],
  rubric: string,
  envFileWarning: string,
  onProgress: (message: string) => void
): Promise<EvaluationResult> {
  // Stage 1: Chunk files and generate summaries to reduce final prompt size
  onProgress(`Dividiendo ${files.length} archivos en fragmentos manejables...`);
  const chunks: GitHubFile[][] = [];
  let currentChunk: GitHubFile[] = [];
  let currentChunkSize = 0;

  for (const file of files) {
    const fileString = `\n--- INICIO ARCHIVO: ${file.path} ---\n\`\`\`\n${file.content}\n\`\`\`\n--- FIN ARCHIVO: ${file.path} ---\n`;
    if (currentChunk.length > 0 && currentChunkSize + fileString.length > CHUNK_SIZE_LIMIT) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentChunkSize = 0;
    }
    currentChunk.push(file);
    currentChunkSize += fileString.length;
  }
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }
  
  onProgress(`Se crearon ${chunks.length} fragmentos. Resumiendo cada uno con IA...`);
  const summaryPromises = chunks.map((chunk, index) => {
    onProgress(`Analizando y resumiendo el fragmento ${index + 1} de ${chunks.length}...`);
    return summarizeFileChunk(chunk);
  });
  
  const summaries = await Promise.all(summaryPromises);
  const combinedSummary = summaries.map((summary, index) => 
    `--- RESUMEN DEL FRAGMENTO ${index + 1} ---\n${summary}`
  ).join('\n\n');

  // Stage 2: Perform the final evaluation using the collected summaries
  onProgress('Resúmenes completos. Realizando la evaluación final...');

  const systemInstruction = `Eres un experto en ingeniería de software y ciencia de datos, actuando como un asistente de profesor riguroso, justo y constructivo para evaluar proyectos universitarios.

Tu tarea es analizar los **resúmenes** del código de un repositorio y evaluarlo estrictamente según la rúbrica proporcionada. No tienes acceso al código completo, así que basa tu evaluación únicamente en los resúmenes.

**Instrucciones Clave:**
1.  **Rúbrica Estricta:** Basa TODA tu evaluación en los criterios y puntajes definidos en la rúbrica.
2.  **Feedback Basado en Resúmenes:** Tu feedback debe ser concreto, haciendo referencia a la información contenida en los resúmenes. Si un resumen menciona un archivo específico (ej. \`conf/base/parameters.yml\`), úsalo en tu justificación.
3.  **Justificación Cuantitativa:** Justifica cada puntaje. Si asignas 80/100, explica qué faltó para alcanzar el 100 según la información disponible.
4.  **Formato JSON Obligatorio:** Tu respuesta DEBE ser un único objeto JSON válido. No incluyas texto, markdown, o "backticks" (como \`\`\`json) alrededor del objeto JSON.
5.  **Cálculo de Puntajes:**
    -   El 'score' para cada criterio debe estar entre 0 y 100.
    -   El 'overallScore' debe ser el promedio exacto de los 'score' de todos los criterios.
    -   La 'finalChileanGrade' se calcula como \`((overallScore / 100) * 6) + 1\`, truncado a un decimal.
6.  **Análisis de Profesionalismo:** Presta especial atención a la información sobre reproducibilidad, calidad del código y seguridad mencionada en los resúmenes.
7.  **Alerta de Seguridad:** Si se proporciona una alerta de seguridad (como la presencia de un archivo \`.env\`), DEBES mencionarla de forma prominente y crítica en el \`professionalismSummary\` y aplicar una penalización severa.

**Esquema JSON Requerido:**
\`\`\`json
{
  "overallScore": "number",
  "summary": "string",
  "professionalismSummary": "string",
  "report": [ { "criterion": "string", "score": "number", "feedback": "string" } ],
  "finalChileanGrade": "number"
}
\`\`\`
`;

  const userPrompt = `
**Rúbrica de Evaluación:**
---
${rubric}
---

${envFileWarning}

**Resúmenes del Contenido del Repositorio:**
---
${combinedSummary}
---

Por favor, evalúa el proyecto basándote en la rúbrica y los resúmenes de los archivos. Genera el reporte completo en el formato JSON especificado.
`;
  
  const fullPrompt = `${systemInstruction}\n\n${userPrompt}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        temperature: 0.2,
      },
    });

    const rawText = response.text.trim();
    const jsonStart = rawText.indexOf('{');
    const jsonEnd = rawText.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
      console.error("Respuesta inválida de la IA:", rawText);
      throw new Error('La respuesta de la IA no contenía un objeto JSON válido. Por favor, inténtalo de nuevo.');
    }

    const jsonText = rawText.substring(jsonStart, jsonEnd + 1);
    
    let result: EvaluationResult;
    try {
        result = JSON.parse(jsonText);
    } catch (parseError) {
        console.error("Error al parsear el JSON de la respuesta de la IA:", parseError);
        console.error("JSON extraído:", jsonText);
        throw new Error('La IA devolvió un JSON con formato incorrecto. No se pudo procesar la evaluación.');
    }
    
    if (result.report && result.report.length > 0) {
      const totalScore = result.report.reduce((acc, item) => acc + item.score, 0);
      const calculatedOverallScore = totalScore / result.report.length;
      result.overallScore = parseFloat(calculatedOverallScore.toFixed(1));

      const calculatedGrade = (result.overallScore / 100) * 6 + 1;
      const clampedGrade = Math.min(7.0, Math.max(1.0, calculatedGrade));
      result.finalChileanGrade = Math.floor(clampedGrade * 10) / 10;
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