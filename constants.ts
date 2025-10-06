export const RELEVANT_EXTENSIONS = [
  '.py', '.yml', '.yaml', '.md', '.txt', '.json',
  '.ipynb', '.cfg', '.toml', '.ini', '.js', '.ts', '.html', '.css',
  '.flake8', 'pytest.ini', '.coveragerc', '.pdf'
];

// Patterns to ignore during file discovery (similar to .gitignore)
// All paths are converted to lowercase before matching.
export const IGNORED_PATTERNS = [
  // Python virtual environments
  'venv/',
  '.venv/',
  'env/',
  // Python cache
  '__pycache__/',
  // Common project/editor config
  '.git/',
  '.vscode/',
  'node_modules/',
  '.idea/',
  // OS-specific files
  '.ds_store',
  'thumbs.db',
  // User-added patterns for student projects
  'clases/',
  'ayudantias/',
  'enunciado/',
  'solucionario/',
];


const KEDRO_RUBRIC = `# Rúbrica de Evaluación: Proyecto Machine Learning con Kedro (Nivel Universitario - 3er Año)

## 1. Estructura y Configuración del Proyecto Kedro (10%)
- **(100 pts) Muy buen desempeño:** Proyecto Kedro perfectamente estructurado, configuración completa en \`conf/\`, README detallado, estructura modular clara.
- **(80 pts) Buen desempeño:** Proyecto bien estructurado, configuración funcional, documentación adecuada.
- **(60 pts) Desempeño aceptable:** Estructura básica funcional, configuración mínima operativa.
- **(40 pts) Desempeño incipiente:** Errores en estructura, configuración incompleta.
- **(20 pts) Desempeño insuficiente:** No usa Kedro o estructura incorrecta.
- **(0 pts) No logrado:** No cumple requisitos mínimos.

## 2. Implementación del Catálogo de Datos (10%)
- **(100 pts) Muy buen desempeño:** 3+ datasets correctamente configurados, múltiples formatos (CSV, Excel, Parquet), parametrización, versionado.
- **(80 pts) Buen desempeño:** 3 datasets bien configurados, formatos apropiados.
- **(60 pts) Desempeño aceptable:** 3 datasets básicos funcionales.
- **(40 pts) Desempeño incipiente:** Menos de 3 datasets o errores significativos.
- **(20 pts) Desempeño insuficiente:** Sin catálogo o mal configurado.
- **(0 pts) No logrado:** No cumple requisitos mínimos.

## 3. Desarrollo de Nodos y Funciones (10%)
- **(100 pts) Muy buen desempeño:** Nodos altamente modulares, funciones puras, docstrings completos, manejo de errores, principios SOLID.
- **(80 pts) Buen desempeño:** Nodos bien estructurados, buena documentación.
- **(60 pts) Desempeño aceptable:** Nodos funcionales con modularidad básica.
- **(40 pts) Desempeño incipiente:** Baja modularidad, funciones acopladas.
- **(20 pts) Desempeño insuficiente:** Sin nodos o mal estructurados.
- **(0 pts) No logrado:** No cumple requisitos mínimos.

## 4. Construcción de Pipelines (10%)
- **(100 pts) Muy buen desempeño:** Pipelines organizados por fase CRISP-DM, uso de namespaces, dependencias claras, componibles.
- **(80 pts) Buen desempeño:** Pipelines funcionales bien conectados.
- **(60 pts) Desempeño aceptable:** Pipelines básicos operativos.
- **(40 pts) Desempeño incipiente:** Problemas en dependencias o estructura.
- **(20 pts) Desempeño insuficiente:** Sin pipelines o incorrectos.
- **(0 pts) No logrado:** No cumple requisitos mínimos.

## 5. Análisis Exploratorio de Datos - EDA (10%)
- **(100 pts) Muy buen desempeño:** EDA exhaustivo (univariado, bivariado, multivariado), visualizaciones interactivas, análisis de patrones en 3+ datasets.
- **(80 pts) Buen desempeño:** EDA completo con buenos análisis y visualizaciones.
- **(60 pts) Desempeño aceptable:** EDA básico con estadísticos descriptivos.
- **(40 pts) Desempeño incipiente:** EDA superficial o incompleto.
- **(20 pts) Desempeño insuficiente:** Sin EDA o extremadamente básico.
- **(0 pts) No logrado:** No cumple requisitos mínimos.

## 6. Limpieza y Tratamiento de Datos (10%)
- **(100 pts) Muy buen desempeño:** Estrategias diferenciadas por tipo de variable, manejo sofisticado de outliers/missing values, validación de integridad.
- **(80 pts) Buen desempeño:** Buen tratamiento con estrategias justificadas.
- **(60 pts) Desempeño aceptable:** Limpieza básica implementada.
- **(40 pts) Desempeño incipiente:** Limpieza superficial o con errores.
- **(20 pts) Desempeño insuficiente:** Sin limpieza o mal implementada.
- **(0 pts) No logrado:** No cumple requisitos mínimos.

## 7. Transformación y Feature Engineering (10%)
- **(100 pts) Muy buen desempeño:** Transformaciones avanzadas justificadas, feature engineering creativo, PCA si aplica, pipelines parametrizables.
- **(80 pts) Buen desempeño:** Buenas transformaciones (scaling, encoding), features derivadas.
- **(60 pts) Desempeño aceptable:** Transformaciones básicas (normalización/estandarización).
- **(40 pts) Desempeño incipiente:** Transformaciones limitadas o mal aplicadas.
- **(20 pts) Desempeño insuficiente:** Sin transformaciones necesarias.
- **(0 pts) No logrado:** No cumple requisitos mínimos.

## 8. Identificación de Targets para ML (10%)
- **(100 pts) Muy buen desempeño:** Múltiples targets correctos para regresión y clasificación, justificación sólida basada en negocio, análisis de viabilidad.
- **(80 pts) Buen desempeño:** Targets principales correctos con buena justificación.
- **(60 pts) Desempeño aceptable:** Targets básicos correctos.
- **(40 pts) Desempeño incipiente:** Identificación confusa o parcialmente incorrecta.
- **(20 pts) Desempeño insuficiente:** Sin identificación o completamente mal definidos.
- **(0 pts) No logrado:** No cumple requisitos mínimos.

## 9. Documentación y Notebooks (10%)
- **(100 pts) Muy buen desempeño:** Documentación excepcional, notebooks estructurados por CRISP-DM, markdown detallado, docstrings, README completo.
- **(80 pts) Buen desempeño:** Buena documentación, notebooks claros, código comentado.
- **(60 pts) Desempeño aceptable:** Documentación básica, notebooks funcionales.
- **(40 pts) Desempeño incipiente:** Documentación escasa o confusa.
- **(20 pts) Desempeño insuficiente:** Sin documentación.
- **(0 pts) No logrado:** No cumple requisitos mínimos.

## 10. Reproducibilidad y Mejores Prácticas (10%)
- **(100 pts) Muy buen desempeño:** Completamente reproducible, \`requirements.txt\`, \`parameters.yml\`, logging, tests, PEP8, \`.env\` para credenciales.
- **(80 pts) Buen desempeño:** Reproducible con buenas prácticas implementadas.
- **(60 pts) Desempeño aceptable:** Básicamente reproducible, algunas buenas prácticas.
- **(40 pts) Desempeño incipiente:** Problemas de reproducibilidad.
- **(20 pts) Desempeño insuficiente:** No reproducible.
- **(0 pts) No logrado:** No cumple requisitos mínimos.
`;

const RAG_LLM_RUBRIC = `# Rúbrica de Evaluación: Diseño de Solución con LLM y RAG

## 1. IE1. Diseño del proyecto de agente de IA (15%)
- **(100 pts) Muy buen desempeño:** Diseña el proyecto de agente alineando completamente los requerimientos organizacionales con una propuesta clara, innovadora y viable.
- **(80 pts) Buen desempeño:** Diseña el proyecto considerando adecuadamente los requerimientos, con una propuesta clara y funcional.
- **(60 pts) Desempeño aceptable:** Diseña el proyecto considerando parcialmente los requerimientos organizacionales, con elementos generales o poco detallados.
- **(30 pts) Desempeño incipiente:** Diseña el proyecto de forma poco coherente con los requerimientos del caso, presentando vacíos relevantes.
- **(10 pts) No logrado:** No diseña el proyecto o lo hace sin relación con los requerimientos del caso.

## 2. IE2. Elaboración de prompts para modelos de lenguaje (10%)
- **(100 pts) Muy buen desempeño:** Elabora prompts precisos, bien estructurados y adaptados completamente a los requerimientos del caso.
- **(80 pts) Buen desempeño:** Elabora prompts adecuados y relevantes, con una estructura funcional acorde al caso.
- **(60 pts) Desempeño aceptable:** Elabora prompts con estructura básica y alineación parcial a los requerimientos.
- **(30 pts) Desempeño incipiente:** Elabora prompts poco claros o ambiguos, con escasa relación con los requerimientos.
- **(10 pts) No logrado:** No elabora prompts o lo hace sin conexión con el caso organizacional.

## 3. IE3. Configuración de flujos RAG (10%)
- **(100 pts) Muy buen desempeño:** Configura flujos RAG completos, integrando eficazmente recuperación de datos internos y externos con alta coherencia contextual.
- **(80 pts) Buen desempeño:** Configura flujos RAG funcionales, incluyendo mecanismos adecuados y coherentes con el caso.
- **(60 pts) Desempeño aceptable:** Configura flujos RAG básicos, con integración parcial o limitada de fuentes de datos.
- **(30 pts) Desempeño incipiente:** Configura flujos incompletos o incoherentes con el contexto organizacional.
- **(10 pts) No logrado:** No configura flujos RAG o lo hace de forma incorrecta.

## 4. IE4. Coherencia entre datos y respuestas (10%)
- **(100 pts) Muy buen desempeño:** Determina con precisión la coherencia entre datos y respuestas, justificando su impacto en la credibilidad de la solución.
- **(80 pts) Buen desempeño:** Determina adecuadamente la relación entre datos y respuestas, con argumentación clara.
- **(60 pts) Desempeño aceptable:** Determina parcialmente la coherencia, con explicaciones generales o poco desarrolladas.
- **(30 pts) Desempeño incipiente:** Determina la coherencia de forma confusa o superficial, sin mayor análisis.
- **(10 pts) No logrado:** No determina la coherencia entre datos y respuestas.

## 5. IE5. Planificación de arquitectura (15%)
- **(100 pts) Muy buen desempeño:** Planifica una arquitectura detallada, coherente y eficiente, integrando con claridad todos los módulos de recuperación, procesamiento y generación.
- **(80 pts) Buen desempeño:** Planifica una arquitectura funcional, considerando correctamente los módulos clave.
- **(60 pts) Desempeño aceptable:** Planifica una arquitectura básica, con integración parcial o poco detallada.
- **(30 pts) Desempeño incipiente:** Planifica una arquitectura incompleta o poco clara.
- **(10 pts) No logrado:** No planifica una arquitectura funcional.

## 6. IE6. Diagrama de la arquitectura de solución (10%)
- **(100 pts) Muy buen desempeño:** Construye un diagrama claro, detallado y bien estructurado, con representación precisa de componentes e integración.
- **(80 pts) Buen desempeño:** Construye un diagrama comprensible y funcional, con buena representación de los elementos.
- **(60 pts) Desempeño aceptable:** Construye un diagrama con componentes básicos y organización general.
- **(30 pts) Desempeño incipiente:** Construye un diagrama confuso o incompleto, con errores de representación.
- **(10 pts) No logrado:** No construye el diagrama o lo hace de forma incorrecta.

## 7. IE7. Fundamentación de decisiones de diseño (10%)
- **(100 pts) Muy buen desempeño:** Fundamenta con solidez técnica y claridad argumentativa todas las decisiones de diseño, alineándolas con los objetivos organizacionales.
- **(80 pts) Buen desempeño:** Fundamenta adecuadamente las decisiones de diseño con argumentos relevantes y conexión con los objetivos.
- **(60 pts) Desempeño aceptable:** Fundamenta parcialmente las decisiones, con argumentación general o poco precisa.
- **(30 pts) Desempeño incipiente:** Fundamenta de forma débil o ambigua las decisiones de diseño.
- **(10 pts) No logrado:** No fundamenta las decisiones tomadas.

## 8. IE8. Elaboración de informe técnico (10%)
- **(100 pts) Muy buen desempeño:** Elabora un informe técnico completo, organizado y riguroso, con documentación precisa y elementos visuales relevantes.
- **(80 pts) Buen desempeño:** Elabora un informe adecuado, bien estructurado y con elementos que respaldan las decisiones.
- **(60 pts) Desempeño aceptable:** Elabora un informe con estructura básica y respaldo parcial.
- **(30 pts) Desempeño incipiente:** Elabora un informe poco claro o incompleto, con escasa documentación.
- **(10 pts) No logrado:** No elabora el informe técnico o lo hace de forma deficiente.

## 9. IE9. Uso de lenguaje técnico (10%)
- **(100 pts) Muy buen desempeño:** Utiliza un lenguaje técnico preciso, con argumentaciones bien desarrolladas y respaldadas con evidencias o ejemplos claros.
- **(80 pts) Buen desempeño:** Utiliza un lenguaje técnico adecuado, con argumentos relevantes y respaldos correctos.
- **(60 pts) Desempeño aceptable:** Utiliza un lenguaje técnico básico, con argumentación general o poco desarrollada.
- **(30 pts) Desempeño incipiente:** Utiliza un lenguaje poco técnico o con argumentaciones vagas.
- **(10 pts) No logrado:** No utiliza lenguaje técnico ni respalda sus respuestas.
`;

export const PREDEFINED_RUBRICS = [
  { name: 'Proyecto ML con Kedro', content: KEDRO_RUBRIC },
  { name: 'Solución con LLM y RAG', content: RAG_LLM_RUBRIC },
];

export const DEFAULT_RUBRIC = PREDEFINED_RUBRICS[0].content;