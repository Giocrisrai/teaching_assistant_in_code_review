import type { GitHubFile, JupyterNotebook, NotebookCell } from '../types';
import { base64Decode } from '../utils';

const RELEVANT_EXTENSIONS = [
  '.py', '.yml', '.yaml', '.md', '.txt', '.json',
  '.ipynb', '.cfg', '.toml', '.ini', '.js', '.ts', '.html', '.css',
  '.flake8', 'pytest.ini', '.coveragerc'
];

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

// --- GitHub API Method (for Private Repos) ---
async function getRepoContentsWithToken(
  owner: string,
  repo: string,
  branch: string | null,
  path: string,
  token: string
): Promise<{ files: GitHubFile[], repoName: string, envFileWarning: string }> {
  
    const headers = { Authorization: `token ${token}` };

    // 1. Determine the default branch if not specified
    if (!branch) {
        const repoDetailsUrl = `https://api.github.com/repos/${owner}/${repo}`;
        const repoDetailsResponse = await fetch(repoDetailsUrl, { headers });
        if (!repoDetailsResponse.ok) {
            if (repoDetailsResponse.status === 404) throw new Error("Repositorio no encontrado. Verifica la URL o los permisos del token.");
            throw new Error(`Error al obtener detalles del repo (Estado: ${repoDetailsResponse.status}). Asegúrate de que el token tenga permisos de 'repo'.`);
        }
        const repoDetails = await repoDetailsResponse.json();
        branch = repoDetails.default_branch;
    }

    // 2. Get the commit SHA for the branch to find the root tree
    const branchDetailsUrl = `https://api.github.com/repos/${owner}/${repo}/branches/${branch}`;
    const branchResponse = await fetch(branchDetailsUrl, { headers });
    if (!branchResponse.ok) throw new Error(`No se pudo encontrar la rama '${branch}' (Estado: ${branchResponse.status}).`);
    const branchData = await branchResponse.json();
    const treeSha = branchData.commit.commit.tree.sha;

    // 3. Fetch the entire file tree recursively
    const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`;
    const treeResponse = await fetch(treeUrl, { headers });
    if (!treeResponse.ok) throw new Error("No se pudo obtener el árbol de archivos del repositorio.");
    const treeData = await treeResponse.json();

    const allFiles = treeData.tree as { path: string, type: string, sha: string }[];
    let envFileWarning = '';
    
    if (allFiles.some(file => file.path === '.env')) {
        envFileWarning = "\n--- ALERTA DE SEGURIDAD CRÍTICA ---\nSe detectó un archivo `.env` en el repositorio. Este es un anti-patrón de seguridad grave, ya que expone secretos. Este hecho debe ser mencionado en el feedback y penalizado severamente en la categoría de 'Buenas Prácticas'.\n---------------------------------\n";
    }

    // 4. Filter files based on path and extension
    let relevantFiles = allFiles.filter(item => item.type === 'blob');
    if (path) {
        relevantFiles = relevantFiles.filter(item => item.path.startsWith(path + '/') || item.path === path);
    }
    
    const filesToFetch = relevantFiles.filter(file => 
        RELEVANT_EXTENSIONS.some(ext => file.path.endsWith(ext))
    );

    if (filesToFetch.length === 0) {
      const pathMsg = path ? ` en la ruta especificada ('${path}')` : '';
      throw new Error(`No se encontraron archivos relevantes (.py, .yml, .md, etc.)${pathMsg}. El directorio podría estar vacío o contener tipos de archivo no soportados.`);
    }

    // 5. Fetch content for each file
    const filePromises = filesToFetch.map(async (file): Promise<GitHubFile | null> => {
        const blobUrl = `https://api.github.com/repos/${owner}/${repo}/git/blobs/${file.sha}`;
        try {
            const contentResponse = await fetch(blobUrl, { headers });
            if (!contentResponse.ok) throw new Error(`Estado ${contentResponse.status}`);
            
            const blobData = await contentResponse.json();
            const rawContent = base64Decode(blobData.content);
            
            let processedContent = rawContent;
            if (file.path.endsWith('.ipynb')) {
              processedContent = parseAndFormatNotebook(rawContent);
            }
            return { path: file.path, content: processedContent };
        } catch (error: any) {
            console.warn(`No se pudo obtener el contenido de ${file.path} desde la API de GitHub, se omitirá. Error: ${error.message}`);
            return null;
        }
    });

    const files = (await Promise.all(filePromises)).filter((f): f is GitHubFile => f !== null);
    return { files, repoName: repo, envFileWarning };
}

// --- jsDelivr Method (for Public Repos) ---
async function getRepoContentsWithJsDelivr(
  owner: string,
  repo: string,
  branch: string | null,
  path: string
): Promise<{ files: GitHubFile[], repoName: string, envFileWarning: string }> {
    let ref = branch;
    let listData;

    if (!ref) {
        const candidateBranches = ['main', 'master'];
        for (const candidate of candidateBranches) {
            const listUrl = `https://data.jsdelivr.com/v1/package/gh/${owner}/${repo}@${candidate}/flat`;
            try {
                const listResponse = await fetch(listUrl);
                if (listResponse.ok) {
                    ref = candidate;
                    listData = await listResponse.json();
                    break; 
                }
            } catch (e) { /* continue */ }
        }
        if (!ref) {
            throw new Error(`No se pudo determinar la rama por defecto ('main' o 'master'). Si usa otra, especifícala en la URL.`);
        }
    }

    if (!listData) {
        const listUrl = `https://data.jsdelivr.com/v1/package/gh/${owner}/${repo}@${ref}/flat`;
        const listResponse = await fetch(listUrl);
        if (!listResponse.ok) {
            if (listResponse.status === 404) throw new Error("Repositorio público no encontrado o rama incorrecta. Para repositorios privados, por favor, proporciona un Token de Acceso Personal.");
            throw new Error(`No se pudo obtener la lista de archivos (Estado: ${listResponse.status}).`);
        }
        listData = await listResponse.json();
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
    
    const filesToFetch = relevantFiles
      .map(file => ({ path: file.name.substring(1) }))
      .filter(file => RELEVANT_EXTENSIONS.some(ext => file.path.endsWith(ext)));

    if (filesToFetch.length === 0) {
      const pathMsg = path ? ` en la ruta especificada ('${path}')` : '';
      throw new Error(`No se encontraron archivos relevantes (.py, .yml, .md, etc.)${pathMsg}. El directorio podría estar vacío o contener tipos de archivo no soportados.`);
    }

    const filePromises = filesToFetch.map(async (file): Promise<GitHubFile> => {
      const contentUrl = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${ref}/${file.path}`;
      try {
          const contentResponse = await fetch(contentUrl);
          if (!contentResponse.ok) throw new Error(`Estado ${contentResponse.status}`);
          const rawContent = await contentResponse.text();
          let processedContent = rawContent;
          if (file.path.endsWith('.ipynb')) {
            processedContent = parseAndFormatNotebook(rawContent);
          }
          return { path: file.path, content: processedContent };
      } catch (error: any) {
          console.warn(`No se pudo obtener el contenido de ${file.path} desde jsDelivr, se omitirá. Error: ${error.message}`);
          return { path: file.path, content: `Error: No se pudo obtener el contenido. (${error.message})` };
      }
    });

    const files = (await Promise.all(filePromises)).filter(f => !f.content.startsWith('Error:'));
    return { files, repoName: repo, envFileWarning };
}


export async function getRepoContents(repoUrl: string, githubToken?: string): Promise<{ files: GitHubFile[], repoName: string, envFileWarning: string }> {
  const repoInfo = parseRepoUrl(repoUrl);

  if (!repoInfo) {
    throw new Error('URL de repositorio de GitHub inválida. Por favor, usa un formato válido como https://github.com/owner/repo.');
  }

  const { owner, repo, branch, path } = repoInfo;

  if (githubToken) {
    return getRepoContentsWithToken(owner, repo, branch, path, githubToken);
  } else {
    return getRepoContentsWithJsDelivr(owner, repo, branch, path);
  }
}