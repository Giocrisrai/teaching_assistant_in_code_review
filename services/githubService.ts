import type { GitHubFile, JupyterNotebook, NotebookCell } from '../types';
import { base64Decode } from '../utils';
import { RELEVANT_EXTENSIONS } from '../constants';

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

    let relevantFiles = allFiles.filter(item => item.type === 'blob');
    if (path) {
        relevantFiles = relevantFiles.filter(item => item.path.startsWith(path + '/') || item.path === path);
    }
    
    const filesToList = relevantFiles
        .filter(file => RELEVANT_EXTENSIONS.some(ext => file.path.endsWith(ext)))
        .map(file => ({ path: file.path, sha: file.sha }));
    
    return { files: filesToList, repoName: repo, envFileWarning, defaultBranch: branchToUse! };
}

async function listFilesWithJsDelivr(
    owner: string, repo: string, path: string, branchFromUrl: string | null
): Promise<{ files: RepoFile[], repoName: string, envFileWarning: string, defaultBranch: string }> {
    let ref: string | undefined;
    let listData;
    let discoveredDefaultBranch: string | null = null;

    // If no branch is specified in the URL, try to discover the default branch via GitHub API (unauthenticated)
    if (!branchFromUrl) {
        try {
            const repoDetailsUrl = `https://api.github.com/repos/${owner}/${repo}`;
            const repoDetailsResponse = await fetch(repoDetailsUrl);
            if (repoDetailsResponse.ok) {
                const repoDetails = await repoDetailsResponse.json();
                discoveredDefaultBranch = repoDetails.default_branch;
            }
        } catch (e) {
            console.warn("No se pudo obtener la rama por defecto de la API de GitHub, se usarán nombres comunes.", e);
        }
    }
    
    // Build the list of candidate branches to try, prioritizing URL, then discovered, then common fallbacks.
    const candidates = [];
    if (branchFromUrl) candidates.push(branchFromUrl);
    if (discoveredDefaultBranch) candidates.push(discoveredDefaultBranch);
    candidates.push('main', 'master');
    const candidateBranches = [...new Set(candidates)]; // Ensure unique branches

    for (const candidate of candidateBranches) {
        const listUrl = `https://data.jsdelivr.com/v1/package/gh/${owner}/${repo}@${candidate}/flat`;
        try {
            const listResponse = await fetch(listUrl);
            if (listResponse.ok) {
                ref = candidate;
                listData = await listResponse.json();
                break; 
            }
            if (listResponse.status === 403) {
                 throw new Error("Se ha alcanzado el límite de solicitudes a la API pública (Error 403). Por favor, proporciona un Token de Acceso de GitHub para un análisis más robusto y evitar este límite.");
            }
        } catch (e) { /* continue to next candidate */ }
    }
    
    if (!ref || !listData) {
        throw new Error(`No se pudo encontrar una rama válida. Se intentó con: '${candidateBranches.join("', '")}'. Si el repositorio usa una rama diferente, por favor, especifícala en la URL.`);
    }

    const allFiles = listData.files as { name: string }[];
    let envFileWarning = '';

    if (allFiles.some(file => file.name === '/.env')) {
      envFileWarning = "\n--- ALERTA DE SEGURIDAD CRÍTICA ---\nSe detectó un archivo `.env` en la raíz del repositorio. Este es un anti-patrón de seguridad grave, ya que expone secretos. Este hecho debe ser mencionado en el feedback y penalizado severamente en la categoría de 'Buenas Prácticas'.\n---------------------------------\n";
    }

    let relevantFiles = allFiles;
    if (path) {
      const normalizedPath = `/${path}`;
      relevantFiles = allFiles.filter(item => item.name.startsWith(normalizedPath + '/') || item.name === normalizedPath);
    }
    
    const filesToList = relevantFiles
      .map(file => ({ path: file.name.substring(1) }))
      .filter(file => RELEVANT_EXTENSIONS.some(ext => file.path.endsWith(ext)));

    return { files: filesToList, repoName: repo, envFileWarning, defaultBranch: ref };
}

export async function listRepoFiles(repoUrl: string, githubToken?: string): Promise<{ files: RepoFile[], repoName: string, envFileWarning: string, defaultBranch: string, owner: string }> {
    const repoInfo = parseRepoUrl(repoUrl);
    if (!repoInfo) {
        throw new Error('URL de repositorio de GitHub inválida. Por favor, usa un formato válido como https://github.com/owner/repo.');
    }
    const { owner, repo, path, branch } = repoInfo;

    const listResult = githubToken
        ? await listFilesWithToken(owner, repo, path, githubToken, branch)
        : await listFilesWithJsDelivr(owner, repo, path, branch);

    return { ...listResult, owner };
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
            let rawContent: string;
            if (token && file.sha) { // Use GitHub API
                const blobUrl = `https://api.github.com/repos/${owner}/${repo}/git/blobs/${file.sha}`;
                const contentResponse = await fetch(blobUrl, { headers: { Authorization: `token ${token}` } });
                if (!contentResponse.ok) throw new Error(`Estado ${contentResponse.status}`);
                const blobData = await contentResponse.json();
                rawContent = base64Decode(blobData.content);
            } else { // Use jsDelivr
                const contentUrl = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${file.path}`;
                const contentResponse = await fetch(contentUrl);
                if (!contentResponse.ok) throw new Error(`Estado ${contentResponse.status}`);
                rawContent = await contentResponse.text();
            }
            
            let processedContent = rawContent;
            if (file.path.endsWith('.ipynb')) {
              processedContent = parseAndFormatNotebook(rawContent);
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