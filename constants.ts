
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
    *   100%: Exhaustive EDA (univariate, bivariate, multivariate), interactive visualizations, pattern analysis on 3+ datasets.
    *   80%: Complete EDA with good analysis and visualizations.
    *   60%: Basic EDA with descriptive statistics.
    *   40%: Superficial or incomplete EDA.
    *   20%: No EDA or extremely basic.

6.  **Data Cleaning and Processing (10%)**
    *   100%: Differentiated strategies by variable type, sophisticated handling of outliers/missing values, integrity validation.
    *   80%: Good treatment with justified strategies.
    *   60%: Basic cleaning implemented.
    *   40%: Superficial cleaning or with errors.
    *   20%: No cleaning or poorly implemented.

7.  **Transformation and Feature Engineering (10%)**
    *   100%: Advanced, justified transformations, creative feature engineering, PCA if applicable, parametrizable pipelines.
    *   80%: Good transformations (scaling, encoding), derived features.
    *   60%: Basic transformations (normalization/standardization).
    *   40%: Limited or misapplied transformations.
    *   20%: No necessary transformations performed.

8.  **ML Target Identification (10%)**
    *   100%: Multiple correct targets for regression and classification, solid business-based justification, viability analysis.
    *   80%: Main targets correct with good justification.
    *   60%: Basic targets correct.
    *   40%: Confused or partially incorrect identification.
    *   20%: No identification or completely misdefined.

9.  **Documentation and Notebooks (10%)**
    *   100%: Exceptional documentation, notebooks structured by CRISP-DM, detailed markdown, docstrings, complete README.
    *   80%: Good documentation, clear notebooks, commented code.
    *   60%: Basic documentation, functional notebooks.
    *   40%: Scarce or confusing documentation.
    *   20%: No documentation.

10. **Reproducibility and Best Practices (10%)**
    *   100%: Completely reproducible, \`requirements.txt\`, \`parameters.yml\`, logging, tests, PEP8, \`.env\` for credentials.
    *   80%: Reproducible with good practices implemented.
    *   60%: Basically reproducible, some good practices.
    *   40%: Reproducibility problems.
    *   20%: Not reproducible.
`;
