import type { GitHubFile, JupyterNotebook, NotebookCell } from '../types';
import { base64Decode } from '../utils';
import { RELEVANT_EXTENSIONS, IGNORED_PATTERNS } from '../constants';
import { extractTextFromPdf } from '../utils/pdfParser';
import { extractTextFromOfficeXml } from '../utils/officeParser';

const FILE_LIMIT = 500; // Max number of files to process before triggering AI triage.

interface RepoFile {
    path: string;
    sha?: string; // SHA is only available via GitHub API
}

function parseRepoUrl(url: string): { owner: string; repo: string; branch: string | null; path: string } | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'github.com') return null;

    const pathParts = urlObj.pathname.split('/').filter(p => p);
    if (pathParts.length < 2) return null;
    
    const owner = pathParts[0];
    let repo = pathParts[1];
    
    if (repo.endsWith('.git')) {
      repo = repo.slice(0, -4);
    }
    
    let branch: string | null = null;
    let path = '';

    // Find the segment 'tree' or 'blob', which indicates the start of branch and path info
    const typeIndex = pathParts.findIndex(p => p === 'tree' || p === 'blob');
    
    if (typeIndex !== -1 && pathParts.length > typeIndex + 1) {
        branch = pathParts[typeIndex + 1];
        path = pathParts.slice(typeIndex + 2).join('/');
    }

    return { owner, repo, branch, path };
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
}

function parseAndFormatNotebook(rawContent: string): string {
  try {
    const notebook: JupyterNotebook = JSON.parse(rawContent);
    if (!notebook.cells || !Array.isArray(notebook.cells)) {
      return "Error: Formato de notebook inválido (no se encontró el arreglo 'cells').\n\n" + rawContent;
    }

    let formattedContent = '';
    notebook.cells.forEach((cell: NotebookCell, index: number) => {
      const source = Array.isArray(cell.source) ? cell.source.join('') : String(cell.source);
      
      if (cell.cell_type === 'markdown') {
        formattedContent += `\n--- Celda de Markdown ${index + 1} ---\n`;
        formattedContent += source;
        formattedContent += `\n--- Fin Celda de Markdown ${index + 1} ---\n`;
      } else if (cell.cell_type === 'code') {
        formattedContent += `\n--- Celda de Código ${index + 1} ---\n`;
        formattedContent += '```python\n';
        formattedContent += source;
        formattedContent += '\n```';
        formattedContent += `\n--- Fin Celda de Código ${index + 1} ---\n`;
      }
    });
    return formattedContent;
  } catch (e) {
    console.error("Error al parsear el contenido del notebook:", e);
    return "Error: No se pudo parsear el JSON del notebook. Mostrando contenido en crudo.\n\n" + rawContent;
  }
}

async function listFilesWithToken(
    owner: string, repo: string, path: string, token: string, branchFromUrl: string | null
): Promise<{ files: RepoFile[], repoName: string, envFileWarning: string, defaultBranch: string }> {
    const headers = { Authorization: `token ${token}` };
    let branchToUse = branchFromUrl;

    if (!branchToUse) {
        const repoDetailsUrl = `https://api.github.com/repos/${owner}/${repo}`;
        const repoDetailsResponse = await fetch(repoDetailsUrl, { headers });
        if (!repoDetailsResponse.ok) {
            if (repoDetailsResponse.status === 404) throw new Error("Repositorio no encontrado. Verifica la URL o los permisos del token.");
            throw new Error(`Error al obtener detalles del repo (Estado: ${repoDetailsResponse.status}). Asegúrate de que el token tenga permisos de 'repo'.`);
        }
        const repoDetails = await repoDetailsResponse.json();
        branchToUse = repoDetails.default_branch;
    }

    const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branchToUse}?recursive=1`;
    const treeResponse = await fetch(treeUrl, { headers });
    if (!treeResponse.ok) {
        throw new Error(`No se pudo obtener el árbol de archivos del repositorio para la rama '${branchToUse}'. Verifica que la rama exista y que el token tenga acceso.`);
    }
    const treeData = await treeResponse.json();

    const allFiles = treeData.tree as { path: string, type: string, sha: string }[];
    let envFileWarning = '';
    
    if (allFiles.some(file => file.path.endsWith('/.env') || file.path === '.env')) {
        envFileWarning = "\n--- ALERTA DE SEGURIDAD CRÍTICA ---\nSe detectó un archivo `.env` en el repositorio. Este es un anti-patrón de seguridad grave, ya que expone secretos. Este hecho debe ser mencionado en el feedback y penalizado severamente en la categoría de 'Buenas Prácticas'.\n---------------------------------\n";
    }

    let repoFiles = allFiles.filter(item => item.type === 'blob');
    if (path) {
        repoFiles = repoFiles.filter(item => item.path.startsWith(path + '/') || item.path === path);
    }
    
    const relevantFiles = repoFiles
        .filter(file => {
          const lowerPath = file.path.toLowerCase();
          const isIgnored = IGNORED_PATTERNS.some(pattern => lowerPath.startsWith(pattern) || lowerPath.endsWith(pattern));
          const hasRelevantExtension = RELEVANT_EXTENSIONS.some(ext => lowerPath.endsWith(ext));
          return !isIgnored && hasRelevantExtension;
        })
        .map(file => ({ path: file.path, sha: file.sha }));
    
    return { files: relevantFiles, repoName: repo, envFileWarning, defaultBranch: branchToUse! };
}

async function listFilesPublicRepo(
    owner: string, repo: string, path: string, branchFromUrl: string | null
): Promise<{ files: RepoFile[], repoName: string, envFileWarning: string, defaultBranch: string }> {
    let discoveredDefaultBranch: string | null = null;
    let rateLimitSuspected = false;

    if (!branchFromUrl) {
        try {
            const repoDetailsUrl = `https://api.github.com/repos/${owner}/${repo}`;
            const repoDetailsResponse = await fetch(repoDetailsUrl);
            if (repoDetailsResponse.ok) {
                const repoDetails = await repoDetailsResponse.json();
                discoveredDefaultBranch = repoDetails.default_branch;
            } else if (repoDetailsResponse.status === 403) {
                rateLimitSuspected = true;
                console.warn("Límite de la API de GitHub alcanzado al intentar obtener la rama por defecto.");
            }
        } catch (e) {
            console.warn("No se pudo obtener la rama por defecto de la API de GitHub.", e);
        }
    }
    
    const candidates = [];
    if (branchFromUrl) candidates.push(branchFromUrl);
    if (discoveredDefaultBranch) candidates.push(discoveredDefaultBranch);
    candidates.push('main', 'master', 'develop', 'dev');
    const candidateBranches = [...new Set(candidates)];

    for (const candidate of candidateBranches) {
        const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${candidate}?recursive=1`;
        try {
            const treeResponse = await fetch(treeUrl);
            if (treeResponse.ok) {
                const treeData = await treeResponse.json();
                const allFiles = treeData.tree as { path: string, type: string }[];
                let envFileWarning = '';

                if (allFiles.some(file => file.path.endsWith('/.env') || file.path === '.env')) {
                    envFileWarning = "\n--- ALERTA DE SEGURIDAD CRÍTICA ---\nSe detectó un archivo `.env` en el repositorio. Este es un anti-patrón de seguridad grave, ya que expone secretos. Este hecho debe ser mencionado en el feedback y penalizado severamente en la categoría de 'Buenas Prácticas'.\n---------------------------------\n";
                }

                let repoFiles = allFiles.filter(item => item.type === 'blob');
                if (path) {
                    repoFiles = repoFiles.filter(item => item.path.startsWith(path + '/') || item.path === path);
                }
                
                const relevantFiles = repoFiles
                    .filter(file => {
                        const lowerPath = file.path.toLowerCase();
                        const isIgnored = IGNORED_PATTERNS.some(pattern => lowerPath.startsWith(pattern) || lowerPath.endsWith(pattern));
                        const hasRelevantExtension = RELEVANT_EXTENSIONS.some(ext => lowerPath.endsWith(ext));
                        return !isIgnored && hasRelevantExtension;
                    })
                    .map(file => ({ path: file.path })); 
                
                return { files: relevantFiles, repoName: repo, envFileWarning, defaultBranch: candidate };
            }
            if (treeResponse.status === 403) {
                 rateLimitSuspected = true;
            }
        } catch (e) { /* continue to next candidate */ }
    }
    
    const attemptedBranches = candidateBranches.map(b => `'${b}'`).join(', ');
    let errorMessage = `No se pudo encontrar una rama válida para el repositorio. Se intentó con: ${attemptedBranches}.`;

    if (rateLimitSuspected) {
        errorMessage += "\n\nCausa probable:\nSe ha alcanzado el límite de solicitudes a la API pública de GitHub, lo que impidió listar los archivos. Esto es común en redes compartidas.";
    } else if (branchFromUrl) {
        errorMessage += `\n\nCausa probable:\nLa rama '${branchFromUrl}' especificada en la URL no existe o el repositorio es privado.`;
    }

    errorMessage += "\n\nSoluciones recomendadas:\n1. Especificar la rama en la URL: Si tu rama no es 'main' o 'master', añádela a la URL (ej. .../tree/develop).\n2. Proporcionar un Token de Acceso de GitHub: Es la solución más fiable. Evita los límites de la API y permite analizar repositorios privados.";
    throw new Error(errorMessage);
}

export async function listRepoFiles(repoUrl: string, githubToken?: string): Promise<{ files: RepoFile[], repoName: string, envFileWarning: string, defaultBranch: string, owner: string }> {
    const repoInfo = parseRepoUrl(repoUrl);
    if (!repoInfo) {
        throw new Error('URL de repositorio de GitHub inválida. Por favor, usa un formato válido como https://github.com/owner/repo.');
    }
    const { owner, repo, path, branch } = repoInfo;

    const listResult = githubToken
        ? await listFilesWithToken(owner, repo, path, githubToken, branch)
        : await listFilesPublicRepo(owner, repo, path, branch);

    return { ...listResult, owner };
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

export async function getFilesContent(
    owner: string,
    repo: string,
    branch: string,
    filesToFetch: RepoFile[],
    token?: string
): Promise<GitHubFile[]> {
    const filePromises = filesToFetch.map(async (file): Promise<GitHubFile | null> => {
        try {
            let processedContent: string;
            const lowerPath = file.path.toLowerCase();

            // Handle binary files first
            if (lowerPath.endsWith('.pdf') || lowerPath.endsWith('.docx') || lowerPath.endsWith('.pptx')) {
                let fileBuffer: ArrayBuffer;
                if (token && file.sha) {
                    const blobUrl = `https://api.github.com/repos/${owner}/${repo}/git/blobs/${file.sha}`;
                    const contentResponse = await fetch(blobUrl, { headers: { Authorization: `token ${token}` } });
                    if (!contentResponse.ok) throw new Error(`Estado ${contentResponse.status}`);
                    const blobData = await contentResponse.json();
                    fileBuffer = base64ToArrayBuffer(blobData.content);
                } else {
                    const contentUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file.path}`;
                    const contentResponse = await fetch(contentUrl);
                    if (!contentResponse.ok) throw new Error(`Estado ${contentResponse.status}`);
                    fileBuffer = await contentResponse.arrayBuffer();
                }

                if (lowerPath.endsWith('.pdf')) {
                    processedContent = await extractTextFromPdf(fileBuffer);
                } else { // It's a .docx or .pptx
                    processedContent = await extractTextFromOfficeXml(fileBuffer, file.path);
                }
            } else {
                // Handle text-based files
                let rawContent: string;
                if (token && file.sha) {
                    const blobUrl = `https://api.github.com/repos/${owner}/${repo}/git/blobs/${file.sha}`;
                    const contentResponse = await fetch(blobUrl, { headers: { Authorization: `token ${token}` } });
                    if (!contentResponse.ok) throw new Error(`Estado ${contentResponse.status}`);
                    const blobData = await contentResponse.json();
                    rawContent = base64Decode(blobData.content);
                } else {
                    const contentUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file.path}`;
                    const contentResponse = await fetch(contentUrl);
                    if (!contentResponse.ok) throw new Error(`Estado ${contentResponse.status}`);
                    rawContent = await contentResponse.text();
                }
                
                if (file.path.endsWith('.ipynb')) {
                    processedContent = parseAndFormatNotebook(rawContent);
                } else {
                    processedContent = rawContent;
                }
            }

            return { path: file.path, content: processedContent };
        } catch (error: any) {
            console.warn(`No se pudo obtener el contenido de ${file.path}, se omitirá. Error: ${error.message}`);
            return null;
        }
    });

    return (await Promise.all(filePromises)).filter((f): f is GitHubFile => f !== null);
}

export { FILE_LIMIT };