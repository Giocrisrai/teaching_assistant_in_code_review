// FIX: Define interfaces for the application's data structures.
export interface GitHubFile {
  path: string;
  content: string;
}

export interface EvaluationItem {
  criterion: string;
  score: number;
  feedback: string;
}

export interface EvaluationResult {
  overallScore: number;
  summary: string;
  professionalismSummary: string;
  report: EvaluationItem[];
  finalChileanGrade: number;
}

// For parsing Jupyter notebooks in githubService
export interface NotebookCell {
  cell_type: 'markdown' | 'code';
  source: string[] | string;
}

export interface JupyterNotebook {
  cells: NotebookCell[];
}
