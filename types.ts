export type AnalysisSource = 'github' | 'zip';

export type GradingScale = 60 | 50 | 0;

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

// For parsing Jupyter notebooks
export interface NotebookCell {
  cell_type: 'markdown' | 'code';
  source: string[] | string;
}

export interface JupyterNotebook {
  cells: NotebookCell[];
}

// Input for the main analysis hook
export type AnalysisInput = { rubric: string; } & (
  | { source: 'github'; repoUrl: string; githubToken: string; }
  | { source: 'zip'; archiveFile: File; }
);