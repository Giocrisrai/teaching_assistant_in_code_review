
export const DEFAULT_RUBRIC = `
You will evaluate a student's Machine Learning project built with the Kedro framework.
The evaluation has 10 criteria, each worth 10% of the total grade.
For each criterion, provide a percentage score and detailed feedback.
After evaluating all criteria, provide an overall summary and a final numerical score.

**Evaluation Criteria (10 indicators)**

1.  **Project Structure and Kedro Configuration (10%)**
    *   100%: Perfectly structured Kedro project, complete configuration in \`conf/\`, detailed README, clear modular structure.
    *   80%: Well-structured project, functional configuration, adequate documentation.
    *   60%: Basic functional structure, minimal operative configuration.
    *   40%: Errors in structure, incomplete configuration.
    *   20%: Does not use Kedro or has an incorrect structure.

2.  **Data Catalog Implementation (10%)**
    *   100%: 3+ datasets correctly configured, multiple formats (CSV, Excel, Parquet), parametrization, versioning.
    *   80%: 3 datasets well-configured in appropriate formats.
    *   60%: 3 basic functional datasets.
    *   40%: Fewer than 3 datasets or significant errors.
    *   20%: No catalog or misconfigured.

3.  **Node and Function Development (10%)**
    *   100%: Highly modular nodes, pure functions, complete docstrings, error handling, SOLID principles.
    *   80%: Well-structured nodes, good documentation.
    *   60%: Functional nodes with basic modularity.
    *   40%: Low modularity, coupled functions.
    *   20%: No nodes or poorly structured.

4.  **Pipeline Construction (10%)**
    *   100%: Pipelines organized by CRISP-DM phase, use of namespaces, clear dependencies, composable.
    *   80%: Functional, well-connected pipelines.
    *   60%: Basic operative pipelines.
    *   40%: Problems in dependencies or structure.
    *   20%: No pipelines or incorrect.

5.  **Exploratory Data Analysis (EDA) (10%)**
    *   100%: Exhaustive EDA (univariate, bivariate, multivariate), pattern analysis on 3+ datasets. To achieve this score, the analysis must incorporate advanced visualization techniques, such as interactive plots (e.g., using Plotly, Bokeh) or dimensionality reduction plots (e.g., PCA, t-SNE), to uncover deeper insights.
    *   80%: Complete EDA with good analysis and visualizations.
    *   60%: Basic EDA with descriptive statistics.
    *   40%: Superficial or incomplete EDA.
    *   20%: No EDA or extremely basic.

6.  **Data Cleaning and Processing (10%)**
    *   100%: Sophisticated, differentiated cleaning strategies by variable type. Exhaustive justification in the notebook for each key decision (e.g., outlier treatment), including a **discussion of alternative methods considered and why they were discarded**. Post-cleaning data integrity validations.
    *   80%: Good treatment with justified strategies.
    *   60%: Basic cleaning implemented.
    *   40%: Superficial cleaning or with errors.
    *   20%: No cleaning or poorly implemented.

7.  **Transformation and Feature Engineering (10%)**
    *   100%: Creative and business-relevant feature engineering. Creation of **novel, non-obvious variables** that demonstrate a deep understanding of the problem domain and positively impact the model. The process is parametrizable and justified.
    *   80%: Good transformations (scaling, encoding), derived features.
    *   60%: Basic transformations (normalization/standardization).
    *   20%: No necessary transformations performed.

8.  **ML Target Identification (10%)**
    *   100%: Multiple correct targets for regression and classification, solid business-based justification, viability analysis, and their alignment with the potential business problem.
    *   80%: Main targets correct with good justification.
    *   60%: Basic targets correct.
    *   40%: Confused or partially incorrect identification.
    *   20%: No identification or completely misdefined.

9.  **Documentation, Notebooks, and Narrative (10%)**
    *   100%: Exceptional documentation. The README is exhaustive, detailing project setup, execution, structure, and key findings. Docstrings are comprehensive and follow a standard style (e.g., Google). Notebooks present a clear, compelling narrative, structured by CRISP-DM phases, with insightful markdown explanations for each step, high-quality, well-labeled visualizations, and concrete conclusions drawn from the analysis. The code within notebooks is itself clean and well-commented.
    *   80%: Good documentation. The README includes setup and execution. Notebooks are well-structured with markdown explanations and clear visualizations. Docstrings are present and informative.
    *   60%: Basic documentation. A functional README exists. Notebooks are functional but lack a clear narrative or detailed explanations. Code may be uncommented.
    *   40%: Deficient or confusing documentation. The README is missing key information. Notebooks are messy, difficult to follow, or lack explanations.
    *   20%: No meaningful documentation or notebooks are just code dumps.

10. **Reproducibility and Best Practices (10%)**
    *   100%: Production-level. The project is 100% reproducible with a single command. Uses a locked dependency file (e.g., \`poetry.lock\`, \`pip-compile\`). Configuration is impeccably managed (e.g., \`parameters.yml\`). **Includes a suite of meaningful unit tests (e.g., using \`pytest\`)** in a \`tests/\` directory. Uses and configures linters and formatters (e.g., Black, Pylint) to ensure consistent, professional code quality. No secrets are committed.
    *   80%: Reproducible with good practices. Dependencies are listed. Code is consistent. May use a linter/formatter. May have some basic tests.
    *   60%: Basically reproducible, some good practices. Includes a requirements.txt, but code style is inconsistent. No tests.
    *   40%: Reproducibility problems. Missing or incomplete dependency files.
    *   20%: Not reproducible, lacks basic configuration and consistency.
`;
