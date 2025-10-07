import JSZip from 'jszip';

// Helper to parse XML and extract text from specified tags
async function extractTextFromXml(xmlString: string, textNodeTag: string): Promise<string> {
  if (typeof window.DOMParser === 'undefined') {
    console.warn("DOMParser not available. Text extraction from Office files may be incomplete.");
    return '';
  }
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");
  const textNodes = xmlDoc.getElementsByTagName(textNodeTag);
  let fullText = '';
  for (let i = 0; i < textNodes.length; i++) {
    if(textNodes[i].textContent) {
      fullText += textNodes[i].textContent + ' ';
    }
  }
  return fullText;
}


/**
 * Extracts text content from a DOCX or PPTX file buffer.
 * @param fileBuffer The file content as an ArrayBuffer.
 * @param fileName The name of the file, used to determine parsing strategy (docx vs pptx).
 * @returns A promise that resolves to the extracted text as a string.
 */
export async function extractTextFromOfficeXml(fileBuffer: ArrayBuffer, fileName: string): Promise<string> {
  try {
    const jszip = new JSZip();
    const zip = await jszip.loadAsync(fileBuffer);
    let combinedText = '';

    if (fileName.toLowerCase().endsWith('.docx')) {
      const docXml = zip.file('word/document.xml');
      if (docXml) {
        const content = await docXml.async('string');
        combinedText = await extractTextFromXml(content, 'w:t');
      }
    } else if (fileName.toLowerCase().endsWith('.pptx')) {
      const slidePromises: Promise<string>[] = [];
      const slidesFolder = zip.folder('ppt/slides');
      if (slidesFolder) {
        slidesFolder.forEach((relativePath, file) => {
            if (relativePath.startsWith('slide') && relativePath.endsWith('.xml')) {
            slidePromises.push(file.async('string'));
            }
        });
      }
      
      const slideXmls = await Promise.all(slidePromises);
      for (const slideXml of slideXmls) {
        combinedText += await extractTextFromXml(slideXml, 'a:t') + '\n\n';
      }
    } else {
        return "Error: Formato de archivo de Office no soportado.";
    }

    return combinedText.trim();
  } catch (error) {
    console.error(`Error procesando el archivo ${fileName}:`, error);
    return `Error: No se pudo extraer el texto del archivo ${fileName}. Puede estar corrupto o tener un formato no compatible.`;
  }
}