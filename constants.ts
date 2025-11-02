export const RELEVANT_EXTENSIONS = [
  '.py', '.yml', '.yaml', '.md', '.txt', '.json',
  '.ipynb', '.cfg', '.toml', '.ini', '.js', '.ts', '.html', '.css',
  '.flake8', 'pytest.ini', '.coveragerc', '.pdf', '.docx', '.pptx'
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
  '__macosx/',
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

const AGENT_FUNCIONAL_RUBRIC = `# Rúbrica de Evaluación: Desarrollo de un Agente Funcional

## 1. IE1. Configuración de Herramientas del Agente (10%)
- **(100 pts) Muy buen desempeño:** Configura todas las herramientas del agente de forma autónoma y precisa, ejecutando funciones específicas sin errores.
- **(80 pts) Buen desempeño:** Configura la mayoría de las herramientas del agente, logrando autonomía funcional con mínimos ajustes necesarios.
- **(60 pts) Desempeño aceptable:** Configura parcialmente las herramientas del agente, permitiendo funciones básicas con autonomía limitada.
- **(30 pts) Desempeño incipiente:** Configura algunas herramientas del agente, pero con errores que impiden su funcionamiento autónomo.
- **(0 pts) No logrado:** No configura herramientas o la configuración impide la ejecución de funciones.

## 2. IE2. Integración de Frameworks y Escalabilidad (10%)
- **(100 pts) Muy buen desempeño:** Integra frameworks totalmente adecuados, asegurando escalabilidad y compatibilidad técnica.
- **(80 pts) Buen desempeño:** Integra frameworks adecuados con leves limitaciones en escalabilidad o compatibilidad.
- **(60 pts) Desempeño aceptable:** Integra frameworks parcialmente adecuados, comprometiendo uno de los dos criterios (escalabilidad o compatibilidad).
- **(30 pts) Desempeño incipiente:** Integra frameworks poco adecuados que limitan seriamente el desempeño del agente.
- **(0 pts) No logrado:** No integra frameworks o los integrados no permiten desarrollo funcional del agente.

## 3. IE3. Configuración de Memoria de Contenido (10%)
- **(100 pts) Muy buen desempeño:** Configura completamente los procesos de memoria de contenido, asegurando continuidad efectiva en flujos prolongados.
- **(80 pts) Buen desempeño:** Configura los procesos de memoria con pequeñas fallas que afectan levemente la continuidad.
- **(60 pts) Desempeño aceptable:** Configura parcialmente los procesos de memoria, con limitaciones notables en la continuidad del flujo.
- **(30 pts) Desempeño incipiente:** Configura procesos de memoria de forma deficiente, afectando significativamente la continuidad.
- **(0 pts) No logrado:** No configura procesos de memoria de contenido o estos son inoperantes.

## 4. IE4. Recuperación de Contexto Semántico (10%)
- **(100 pts) Muy buen desempeño:** Configura de forma completa y precisa la recuperación semántica de contexto, logrando continuidad sólida.
- **(80 pts) Buen desempeño:** Configura recuperación semántica con pequeños errores que no comprometen mayormente el flujo.
- **(60 pts) Desempeño aceptable:** Configura parcialmente la recuperación de contexto, con interrupciones ocasionales en el flujo.
- **(30 pts) Desempeño incipiente:** Configura procesos incompletos o inconsistentes de recuperación semántica, generando interrupciones frecuentes.
- **(0 pts) No logrado:** No configura procesos de recuperación de contexto o son ineficaces.

## 5. IE5. Diseño y Planificación de Tareas (10%)
- **(100 pts) Muy buen desempeño:** Diseña esquemas de planificación claros, lógicos y priorizados que optimizan el flujo de tareas del agente.
- **(80 pts) Buen desempeño:** Diseña esquemas funcionales con pequeñas mejoras pendientes en la secuenciación o prioridades.
- **(60 pts) Desempeño aceptable:** Diseña esquemas con lógica básica pero poco priorizados o incompletos.
- **(30 pts) Desempeño incipiente:** Diseña esquemas confusos o sin una secuencia clara de tareas.
- **(0 pts) No logrado:** No diseña esquemas de planificación de tareas.

## 6. IE6. Toma de Decisiones Adaptativa del Agente (10%)
- **(100 pts) Muy buen desempeño:** Demuestra con múltiples ejemplos claros cómo el agente toma decisiones adaptativas según el entorno.
- **(80 pts) Buen desempeño:** Demuestra ejemplos relevantes aunque con menor diversidad o profundidad en los escenarios.
- **(60 pts) Desempeño aceptable:** Demuestra ejemplos básicos que ilustran decisiones del agente de forma limitada.
- **(30 pts) Desempeño incipiente:** Demuestra ejemplos poco claros o que no evidencian adecuadamente el comportamiento del agente.
- **(0 pts) No logrado:** No demuestra ejemplos de toma de decisiones o los ejemplos no son válidos.

## 7. IE7. Documentación de Arquitectura (Diagrama y README) (10%)
- **(100 pts) Muy buen desempeño:** Elabora diagrama y README completos y claros, describiendo la arquitectura del agente con detalle.
- **(80 pts) Buen desempeño:** Elabora ambos recursos con información adecuada pero menor nivel de detalle o claridad.
- **(60 pts) Desempeño aceptable:** Elabora uno de los recursos correctamente o ambos de forma parcial.
- **(30 pts) Desempeño incipiente:** Elabora los recursos de forma incompleta o confusa, dificultando la comprensión de la arquitectura.
- **(0 pts) No logrado:** No elabora diagrama ni README o el contenido no es pertinente.

## 8. IE8. Justificación de la Elección de Componentes (10%)
- **(100 pts) Muy buen desempeño:** Justifica de forma clara y fundamentada la elección de todos los componentes según los requerimientos del flujo.
- **(80 pts) Buen desempeño:** Justifica la mayoría de las elecciones, con razonamientos técnicos pertinentes.
- **(60 pts) Desempeño aceptable:** Justifica parcialmente las elecciones, sin evidencia clara de alineación con el flujo.
- **(30 pts) Desempeño incipiente:** Justifica de forma limitada o con argumentos poco pertinentes.
- **(0 pts) No logrado:** No justifica la elección de componentes o lo hace incorrectamente.

## 9. IE9. Elaboración de Informe Técnico (10%)
- **(100 pts) Muy buen desempeño:** Elabora un informe técnico completo, con diagramas precisos y documentación sólida que respalda el diseño.
- **(80 pts) Buen desempeño:** Elabora un informe adecuado, con diagramas funcionales y documentación general.
- **(60 pts) Desempeño aceptable:** Elabora un informe con contenido parcial o incompleto en diagramas o documentación.
- **(30 pts) Desempeño incipiente:** Elabora un informe poco estructurado, con escasa documentación o ausencias notables.
- **(0 pts) No logrado:** No elabora informe técnico o el contenido es irrelevante.

## 10. IE10. Uso de Lenguaje Técnico y Argumentación (10%)
- **(100 pts) Muy buen desempeño:** Utiliza lenguaje técnico preciso, con argumentación sólida respaldada en ejemplos o evidencia clara.
- **(80 pts) Buen desempeño:** Utiliza lenguaje técnico adecuado y presenta argumentos bien fundamentados en general.
- **(60 pts) Desempeño aceptable:** Utiliza lenguaje técnico básico y presenta argumentos con escaso respaldo.
- **(30 pts) Desempeño incipiente:** Utiliza lenguaje poco técnico o argumentos débiles y poco claros.
- **(0 pts) No logrado:** No utiliza lenguaje técnico ni presenta argumentos válidos.
`;

export const PREDEFINED_RUBRICS = [
  { name: 'Proyecto ML con Kedro', content: KEDRO_RUBRIC },
  { name: 'Solución con LLM y RAG', content: RAG_LLM_RUBRIC },
  { name: 'Desarrollo de Agente Funcional', content: AGENT_FUNCIONAL_RUBRIC },
];

export const DEFAULT_RUBRIC = PREDEFINED_RUBRICS[0].content;