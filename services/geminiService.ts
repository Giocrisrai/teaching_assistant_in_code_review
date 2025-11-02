import { GoogleGenAI, Type } from "@google/genai";
import type { GitHubFile, EvaluationResult } from '../types';

// Per instructions, initialize the client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Set a character limit for each chunk to avoid oversized prompts that can cause 500 errors.
const CHUNK_SIZE_LIMIT = 150000;
const TRIAGE_FILE_LIMIT = 200; // Max files for AI to select in triage phase.


/**
 * Given a large list of file paths, asks the Gemini API to select the most relevant ones for analysis.
 * This is a triage step to handle exceptionally large repositories.
 * @param filePaths - An array of all file paths in the repo.
 * @param rubric - The evaluation rubric to give context to the AI.
 * @returns A promise that resolves to an array of the most relevant file paths.
 */
export async function selectRelevantFilesWithGemini(filePaths: string[], rubric: string): Promise<string[]> {
    const prompt = `Eres un arquitecto de software experto y asistente de profesor. Tu tarea es analizar la siguiente lista de rutas de archivo de un repositorio de GitHub y seleccionar las más importantes para realizar una evaluación de código.

**Contexto:** El repositorio es demasiado grande para analizarlo por completo. Debes identificar un subconjunto de archivos que represente mejor la arquitectura, la lógica de negocio principal y la calidad general del proyecto, basándote en la rúbrica de evaluación que se te proporcionará.

**Instrucciones:**
1.  **Analiza la Rúbrica:** Lee la rúbrica para entender qué aspectos son los más importantes (ej. estructura del proyecto, pipelines de datos, configuración, etc.).
2.  **Prioriza el Código Fuente:** Da **máxima prioridad al código de implementación** (archivos \`.py\`, \`.js\`, etc.). Los archivos de configuración (ej. \`pyproject.toml\`, \`catalog.yml\`), pipelines y notebooks son importantes, pero la evaluación final depende del código que implementa la lógica. Un buen README no compensa la falta de código.
3.  **Descarta Archivos Secundarios:** Generalmente, puedes ignorar archivos de tests masivos, archivos de configuración de linters, \`.gitignore\`, o documentación genérica si necesitas reducir el número.
4.  **Sé Estratégico:** Elige una muestra representativa que permita una evaluación justa.
5.  **Límite Estricto:** Debes seleccionar un máximo de ${TRIAGE_FILE_LIMIT} archivos.
6.  **Formato de Salida:** Tu respuesta DEBE ser un objeto JSON que contenga una única clave "selected_files", cuyo valor sea un array de strings con las rutas de los archivos seleccionados.

**Rúbrica de Evaluación:**
---
${rubric}
---

**Lista Completa de Archivos:**
---
${JSON.stringify(filePaths, null, 2)}
---

Ahora, selecciona los archivos más críticos y devuelve el resultado en el formato JSON especificado.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.1,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        selected_files: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["selected_files"]
                }
            },
        });

        const rawText = response.text.trim();
        const result = JSON.parse(rawText);
        
        if (result && result.selected_files && Array.isArray(result.selected_files)) {
            return result.selected_files;
        } else {
            console.error("La respuesta de triaje de la IA no tenía el formato esperado:", result);
            // Fallback: return the first N files if triage fails
            return filePaths.slice(0, TRIAGE_FILE_LIMIT);
        }
    } catch (error) {
        console.error('Error durante el triaje de archivos con la IA:', error);
        // Fallback on error
        return filePaths.slice(0, TRIAGE_FILE_LIMIT);
    }
}


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
2.  **Principio de Verificación (¡Muy Importante!):** Tu evaluación debe basarse en la **evidencia de implementación** presente en los resúmenes del código fuente (ej. archivos \`.py\`). Los documentos descriptivos (como README.md o notebooks con mucho texto) son importantes, pero **no sustituyen al código**. Si un proyecto describe funcionalidades complejas en su documentación pero los resúmenes de código no muestran una implementación correspondiente, **debes penalizar severamente** en los criterios relevantes. Corrobora siempre las afirmaciones con los hechos del código.
3.  **Evaluación Evolutiva:** Ten en cuenta que el proyecto puede ser una continuación de una entrega anterior. Céntrate en evaluar el trabajo según la **rúbrica actual**. Si identificas código o conceptos de una entrega previa (por ejemplo, un sistema RAG en un proyecto sobre Agentes Funcionales), evalúa cómo se integra y evoluciona para cumplir los nuevos requisitos, en lugar de simplemente re-evaluarlo con criterios antiguos. El feedback debe ser constructivo, reconociendo el trabajo previo pero enfocándose en el cumplimiento de los objetivos de la evaluación actual.
4.  **Feedback Basado en Resúmenes:** Tu feedback debe ser concreto, haciendo referencia a la información contenida en los resúmenes. Si un resumen menciona un archivo específico (ej. \`conf/base/parameters.yml\`), úsalo en tu justificación.
5.  **Justificación Cuantitativa:** Justifica cada puntaje. Si asignas 80/100, explica qué faltó para alcanzar el 100 según la información disponible.
6.  **Formato JSON Obligatorio:** Tu respuesta DEBE ser un único objeto JSON válido. No incluyas texto, markdown, o "backticks" (como \`\`\`json) alrededor del objeto JSON.
7.  **Cálculo de Puntajes:**
    -   El 'score' para cada criterio debe estar entre 0 y 100.
    -   El 'overallScore' debe ser el promedio exacto de los 'score' de todos los criterios.
    -   La 'finalChileanGrade' se calcula como \`((overallScore / 100) * 6) + 1\`. No la redondees aquí, solo el cálculo directo.
8.  **Análisis de Profesionalismo:** Presta especial atención a la información sobre reproducibilidad, calidad del código y seguridad mencionada en los resúmenes.
9.  **Alerta de Seguridad:** Si se proporciona una alerta de seguridad (como la presencia de un archivo \`.env\`), DEBES mencionarla de forma prominente y crítica en el \`professionalismSummary\` y aplicar una penalización severa.

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
    
    // Post-processing to ensure consistency. The frontend will do the final, authoritative calculation.
    if (result.report && result.report.length > 0) {
      const totalScore = result.report.reduce((acc, item) => acc + item.score, 0);
      const calculatedOverallScore = totalScore / result.report.length;
      result.overallScore = parseFloat(calculatedOverallScore.toFixed(1));
      
      // Provide a basic proportional grade as a starting point. The UI will immediately recalculate it.
      const calculatedGrade = (result.overallScore / 100) * 6 + 1;
      const clampedGrade = Math.min(7.0, Math.max(1.0, calculatedGrade));
      result.finalChileanGrade = Math.round(clampedGrade * 10) / 10;
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