import type { GitHubFile, JupyterNotebook, NotebookCell } from '../types';

const RELEVANT_EXTENSIONS = [
  '.py', '.yml', '.yaml', '.md', '.txt', '.json',
  '.ipynb', '.cfg', '.toml', '.ini'
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

export async function getRepoContents(repoUrl: string): Promise<{ files: GitHubFile[], repoName: string }> {
  const repoInfo = parseRepoUrl(repoUrl);

  if (!repoInfo) {
    throw new Error('URL de repositorio de GitHub inválida. Por favor, usa un formato válido como https://github.com/owner/repo.');
  }

  let { owner, repo, branch, path } = repoInfo;
  let ref = branch;
  let listData;

  // 1. Resolve default reference if no branch is specified by probing common names
  if (!ref) {
    const candidateBranches = ['main', 'master'];
    let foundBranch = false;

    for (const candidate of candidateBranches) {
      console.log(`Intentando con la rama por defecto: '${candidate}'...`);
      const listUrl = `https://data.jsdelivr.com/v1/package/gh/${owner}/${repo}@${candidate}/flat`;
      try {
        const listResponse = await fetch(listUrl);
        if (listResponse.ok) {
          ref = candidate;
          listData = await listResponse.json();
          foundBranch = true;
          console.log(`¡Éxito! Rama por defecto encontrada: '${ref}'`);
          break; 
        }
      } catch (e) {
        console.warn(`Error al verificar la rama '${candidate}':`, e);
      }
    }

    if (!foundBranch) {
      throw new Error(`No se pudo determinar la rama por defecto. Se intentó con 'main' y 'master' sin éxito. Por favor, especifica la rama en la URL (ej: .../tree/main).`);
    }
  }

  // 2. Fetch the file list if it wasn't fetched during branch detection
  if (!listData) {
      const listUrl = `https://data.jsdelivr.com/v1/package/gh/${owner}/${repo}@${ref}/flat`;
      const listResponse = await fetch(listUrl);
      if (!listResponse.ok) {
        throw new Error(`No se pudo obtener la lista de archivos para la rama/ref '${ref}' (Estado: ${listResponse.status}). Asegúrate que la rama exista.`);
      }
      listData = await listResponse.json();
  }

  const allFiles = listData.files as { name: string }[];

  // 3. Filter for relevant files
  let relevantFiles = allFiles;
  
  if (path) {
    const normalizedPath = `/${path}`;
    relevantFiles = allFiles.filter(item => item.name.startsWith(normalizedPath + '/') || item.name === normalizedPath);
  }
  
  const filesToFetch = relevantFiles
    .map(file => ({ path: file.name.substring(1) }))
    .filter(file => 
      RELEVANT_EXTENSIONS.some(ext => file.path.endsWith(ext))
    );

  if (filesToFetch.length === 0) {
    const pathMsg = path ? ` en la ruta especificada ('${path}')` : '';
    throw new Error(`No se encontraron archivos relevantes (.py, .yml, .md, etc.)${pathMsg}. El directorio podría estar vacío o contener tipos de archivo no soportados.`);
  }

  // 4. Fetch content for each relevant file
  const filePromises = filesToFetch.map(async (file): Promise<GitHubFile> => {
    const contentUrl = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${ref}/${file.path}`;
    try {
        const contentResponse = await fetch(contentUrl);
        if (!contentResponse.ok) {
            throw new Error(`Estado ${contentResponse.status}`);
        }
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

  const files = await Promise.all(filePromises);
  const filteredFiles = files.filter(f => !f.content.startsWith('Error:'));
  return { files: filteredFiles, repoName: repo };
}