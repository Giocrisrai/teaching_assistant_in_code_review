
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

const ML_PIPELINES_DVC_AIRFLOW_RUBRIC = `# Rúbrica de Evaluación: Pipelines de ML con DVC, Airflow y Docker

## 1. Integración de Pipelines Kedro (8%)
- **(100 pts) Muy buen desempeño:** Ambos pipelines (clasificación y regresión) son modulares, ejecutables sin errores y siguen las mejores prácticas de Kedro.
- **(80 pts) Buen desempeño:** Pipelines funcionales y bien estructurados, con pequeños detalles a mejorar.
- **(60 pts) Desempeño aceptable:** Pipelines básicos operativos, pero con problemas de modularidad o claridad.
- **(40 pts) Desempeño incipiente:** Pipelines con errores de ejecución o mal estructurados.
- **(20 pts) Desempeño insuficiente:** No se implementan pipelines funcionales en Kedro.
- **(0 pts) No logrado:** No cumple requisitos mínimos.

## 2. DVC (datos, features, modelos, métricas) (7%)
- **(100 pts) Muy buen desempeño:** Uso completo de DVC. \`dvc.yaml\` define stages claros. Todos los artefactos (datos, features, modelos, métricas) están correctamente versionados y son reproducibles.
- **(80 pts) Buen desempeño:** DVC se usa correctamente para versionar los artefactos principales.
- **(60 pts) Desempeño aceptable:** Uso básico de DVC, pero faltan stages o algunos artefactos no están versionados.
- **(40 pts) Desempeño incipiente:** \`dvc.yaml\` mal configurado o uso incorrecto de los comandos de DVC.
- **(20 pts) Desempeño insuficiente:** No se utiliza DVC o su uso es meramente testimonial.
- **(0 pts) No logrado:** No cumple requisitos mínimos.

## 3. Airflow (DAG orquestado) (7%)
- **(100 pts) Muy buen desempeño:** Un DAG de Airflow orquesta la ejecución de ambos pipelines (clasificación y regresión) de forma secuencial o paralela, y consolida los resultados de forma exitosa. El DAG es robusto y claro.
- **(80 pts) Buen desempeño:** DAG funcional que ejecuta ambos pipelines, con pequeños detalles de mejora en la consolidación o logs.
- **(60 pts) Desempeño aceptable:** DAG básico que logra ejecutar los pipelines, pero con problemas de dependencias o sin consolidación de resultados.
- **(40 pts) Desempeño incipiente:** El DAG tiene errores y no logra ejecutar los pipelines de forma fiable.
- **(20 pts) Desempeño insuficiente:** No se implementa un DAG de Airflow.
- **(0 pts) No logrado:** No cumple requisitos mínimos.

## 4. Docker (portabilidad) (7%)
- **(100 pts) Muy buen desempeño:** Imagen de Docker funcional, reproducible y optimizada. Incluye instrucciones claras (\`README.md\`) para construir y ejecutar el entorno completo (Kedro, Airflow, DVC).
- **(80 pts) Buen desempeño:** Imagen funcional y reproducible con instrucciones adecuadas.
- **(60 pts) Desempeño aceptable:** La imagen se construye y ejecuta, pero no es eficiente o las instrucciones son poco claras.
- **(40 pts) Desempeño incipiente:** Errores al construir o ejecutar la imagen de Docker.
- **(20 pts) Desempeño insuficiente:** No se proporciona un \`Dockerfile\` funcional.
- **(0 pts) No logrado:** No cumple requisitos mínimos.

## 5. Métricas y visualizaciones (10%)
- **(100 pts) Muy buen desempeño:** Se utilizan métricas apropiadas para clasificación (ej. AUROC, F1-score, Confusion Matrix) y regresión (ej. R2, RMSE, MAE). Se presenta una tabla comparativa clara y visualizaciones (gráficos) que facilitan el análisis de resultados de todos los modelos.
- **(80 pts) Buen desempeño:** Se usan métricas correctas y se presenta una tabla comparativa funcional.
- **(60 pts) Desempeño aceptable:** Se usan métricas básicas y la comparación es limitada.
- **(40 pts) Desempeño incipiente:** Métricas incorrectas o mal interpretadas.
- **(20 pts) Desempeño insuficiente:** No se reportan métricas de evaluación.
- **(0 pts) No logrado:** No cumple requisitos mínimos.

## 6. Cobertura de modelos + Tuning + CV (24%)
- **(100 pts) Muy buen desempeño:** Se implementan y comparan 5 o más modelos para clasificación Y 5 o más para regresión. Se realiza búsqueda de hiperparámetros con GridSearchCV y validación cruzada (k>=5) para los mejores modelos. La tabla comparativa incluye media y desviación estándar de las métricas.
- **(80 pts) Buen desempeño:** Se cumple con el número de modelos y se aplica GridSearch/CV correctamente.
- **(60 pts) Desempeño aceptable:** Se implementan menos de 5 modelos por tipo, o la búsqueda de hiperparámetros es superficial.
- **(40 pts) Desempeño incipiente:** No se implementa una variedad de modelos o no se realiza tuning.
- **(20 pts) Desempeño insuficiente:** Se implementa un solo modelo básico sin validación.
- **(0 pts) No logrado:** No cumple requisitos mínimos.

## 7. Reproducibilidad (Git+DVC+Docker) (7%)
- **(100 pts) Muy buen desempeño:** El proyecto es 100% reproducible. La combinación de Git, DVC y Docker permite a un tercero clonar el repositorio y ejecutar todo el flujo de trabajo de forma determinística, obteniendo los mismos resultados.
- **(80 pts) Buen desempeño:** El proyecto es reproducible con instrucciones claras, aunque requiera pequeños ajustes manuales.
- **(60 pts) Desempeño aceptable:** La reproducibilidad es parcial, con algunos pasos que fallan o no están documentados.
- **(40 pts) Desempeño incipiente:** Dificultades significativas para reproducir los resultados.
- **(20 pts) Desempeño insuficiente:** El proyecto no es reproducible.
- **(0 pts) No logrado:** No cumple requisitos mínimos.

## 8. Documentación técnica (5%)
- **(100 pts) Muy buen desempeño:** El \`README.md\` es excepcional: explica la arquitectura del proyecto (Kedro, DVC, Airflow, Docker), el propósito de los pipelines, y proporciona instrucciones detalladas y claras para la instalación, ejecución y reproducción de los experimentos.
- **(80 pts) Buen desempeño:** \`README.md\` claro con instrucciones y una descripción adecuada.
- **(60 pts) Desempeño aceptable:** Documentación básica que permite entender el proyecto pero carece de detalles.
- **(40 pts) Desempeño incipiente:** Documentación escasa o confusa.
- **(20 pts) Desempeño insuficiente:** Sin \`README.md\` o documentación técnica.
- **(0 pts) No logrado:** No cumple requisitos mínimos.

## 9. Reporte de experimentos (5%)
- **(100 pts) Muy buen desempeño:** Se presenta un reporte claro (en un notebook o \`README.md\`) que incluye una comparación final de los modelos, una discusión profunda de los resultados obtenidos, y conclusiones bien fundamentadas sobre qué modelo es el mejor para cada tarea y por qué.
- **(80 pts) Buen desempeño:** Reporte funcional con comparación y conclusiones adecuadas.
- **(60 pts) Desempeño aceptable:** Reporte básico con resultados pero poca discusión o análisis.
- **(40 pts) Desempeño incipiente:** Reporte confuso o incompleto.
- **(20 pts) Desempeño insuficiente:** No se presenta un reporte de los experimentos.
- **(0 pts) No logrado:** No cumple requisitos mínimos.

## 10. Defensa técnica (oral) (20%)
- **(100 pts) Muy buen desempeño:** Explicación oral clara, concisa y profunda del flujo de trabajo completo (Kedro-Airflow-DVC-Docker). Demuestra dominio técnico y responde a las preguntas con solvencia.
- **(80 pts) Buen desempeño:** Buena explicación y respuestas correctas a las preguntas.
- **(60 pts) Desempeño aceptable:** Explicación básica con algunas imprecisiones.
- **(40 pts) Desempeño incipiente:** Explicación confusa o incapacidad para responder preguntas técnicas.
- **(20 pts) Desempeño insuficiente:** No presenta defensa técnica.
- **(0 pts) No logrado:** No cumple requisitos mínimos.
- **NOTA PARA IA:** Este criterio se evalúa de forma externa y no puede ser medido a partir del código. **Asigna un puntaje de 0** y en el campo de 'feedback' escribe exactamente: "Este criterio se evalúa de forma oral y no puede ser calificado automáticamente. El puntaje debe ser ajustado manualmente por el evaluador."
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
- **(60 pts) Desempeño aceptable:** Configura flujos RAG básicos, con integração parcial o limitada de fuentes de datos.
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
- **(100 pts) Muy buen desempeño:** Construye un diagrama claro, detallado y bien estructurado, con representación precisa de componentes e integração.
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

const OBSERVABILITY_RUBRIC = `# Rúbrica de Evaluación: Implementación de Observabilidad (Evaluación Parcial N°3)

## 1. IE1. Implementa métricas de observabilidad para medir la precisión, consistencia y frecuencia de errores de un agente de IA en escenarios con variabilidad de datos. (15%)
- **(100 pts) Muy buen desempeño:** Implementa métricas precisas y pertinentes que permiten evaluar en profundidad la precisión, consistencia y errores del agente, adaptándose a escenarios variados.
- **(80 pts) Buen desempeño:** Implementa métricas adecuadas que cubren mayormente los aspectos de precisión, consistencia y errores del agente en contextos variables.
- **(60 pts) Desempeño aceptable:** Implementa métricas básicas que permiten observar parcialmente la precisión y errores del agente, aunque no abordan todos los aspectos.
- **(30 pts) Desempeño incipiente:** Implementa métricas poco pertinentes o incompletas, sin lograr una evaluación clara del comportamiento del agente.
- **(0 pts) Desempeño no logrado:** No implementa métricas de observabilidad o lo hace de manera totalmente incorrecta.

## 2. IE2. Aplica métricas de observabilidad para medir la latencia y el uso de recursos de un agente de IA en escenarios con variabilidad de datos. (15%)
- **(100 pts) Muy buen desempeño:** Aplica métricas precisas y contextualizadas que permiten medir eficazmente la latencia y uso de recursos del agente en distintos escenarios.
- **(80 pts) Buen desempeño:** Aplica métricas relevantes para analizar latencia y recursos, con resultados útiles en la mayoría de los contextos.
- **(60 pts) Desempeño aceptable:** Aplica algunas métricas funcionales, aunque de forma limitada o con escasa contextualización.
- **(30 pts) Desempeño incipiente:** Aplica métricas con errores o sin relación clara con la latencia o el uso de recursos.
- **(0 pts) Desempeño no logrado:** No aplica métricas de observabilidad o no logra relacionarlas con el uso de recursos o la latencia.

## 3. IE3. Examina logs y eventos durante la ejecución, para identificar posibles errores o cuellos de botella. (15%)
- **(100 pts) Muy buen desempeño:** Examina con profundidad y precisión los logs y eventos, identificando correctamente errores y cuellos de botella en la ejecución del agente.
- **(80 pts) Buen desempeño:** Examina los logs de forma adecuada y detecta la mayoría de los problemas presentes.
- **(60 pts) Desempeño aceptable:** Examina parcialmente los logs, reconociendo algunos errores pero sin profundizar en su origen.
- **(30 pts) Desempeño incipiente:** Examina los logs de manera superficial, sin identificar correctamente los problemas.
- **(0 pts) Desempeño no logrado:** No examina los logs o lo hace de manera incorrecta o irrelevante.

## 4. IE4. Identifica patrones o anomalías en los registros, para detectar áreas críticas de mejora. (10%)
- **(100 pts) Muy buen desempeño:** Identifica de forma clara y fundamentada patrones y anomalías, proponiendo mejoras estratégicas con base en los hallazgos.
- **(80 pts) Buen desempeño:** Identifica correctamente patrones y anomalías relevantes, proponiendo mejoras pertinentes.
- **(60 pts) Desempeño aceptable:** Identifica algunos patrones o anomalías, pero sin vincularlos completamente a mejoras concretas.
- **(30 pts) Desempeño incipiente:** Identifica patrones o anomalías de forma superficial o sin conexión con mejoras significativas.
- **(0 pts) Desempeño no logrado:** No identifica patrones ni anomalías en los registros.

## 5. IE5. Construye un dashboard visual que muestra el comportamiento del agente, según las métricas implementadas. (15%)
- **(100 pts) Muy buen desempeño:** Construye un dashboard visual completo, claro e interactivo, que representa con precisión todas las métricas clave del agente.
- **(80 pts) Buen desempeño:** Construye un dashboard visual adecuado y comprensible, que representa correctamente la mayoría de las métricas.
- **(60 pts) Desempeño aceptable:** Construye un dashboard básico, con algunas métricas clave, pero con limitaciones de visualización o diseño.
- **(30 pts) Desempeño incipiente:** Construye un dashboard incompleto o poco claro, que representa métricas de forma parcial o incorrecta.
- **(0 pts) Desempeño no logrado:** No construye un dashboard visual o lo hace sin utilidad para el análisis.

## 6. IE6. Integra protocolos de seguridad y uso responsable en el diseño de agentes, considerando criterios éticos, normativos y de privacidad, en contextos de producción. (10%)
- **(100 pts) Muy buen desempeño:** Integra protocolos robustos de seguridad y uso responsable, alineados con criterios éticos, normativos y de privacidad en todos los niveles del diseño.
- **(80 pts) Buen desempeño:** Integra protocolos adecuados en seguridad y responsabilidad, considerando aspectos normativos y éticos en general.
- **(60 pts) Desempeño aceptable:** Integra algunos protocolos básicos, aunque de forma incompleta o sin cubrir todos los criterios éticos o de privacidad.
- **(30 pts) Desempeño incipiente:** Integra de forma superficial elementos de seguridad o responsabilidad, sin claridad ni alineación normativa.
- **(0 pts) Desempeño no logrado:** No integra protocolos de seguridad ni criterios de responsabilidad en el diseño.

## 7. IE7. Propone mejoras de desempeño o rediseño del agente, basándose en análisis de datos observados, con el fin de aumentar la sostenibilidad y escalabilidad de la solución. (10%)
- **(100 pts) Muy buen desempeño:** Propone mejoras o rediseños bien fundamentados, innovadores y alineados con la sostenibilidad y escalabilidad de la solución.
- **(80 pts) Buen desempeño:** Propone mejoras pertinentes basadas en un análisis adecuado de los datos observados.
- **(60 pts) Desempeño aceptable:** Propone algunas mejoras generales, aunque sin suficiente respaldo en el análisis de datos.
- **(30 pts) Desempeño incipiente:** Propone mejoras poco relevantes o mal fundamentadas.
- **(0 pts) Desempeño no logrado:** No propone mejoras ni rediseño del agente.

## 8. IE8. Elabora un informe técnico, que incluye capturas, gráficos y visualizaciones, respaldando las decisiones de diseño con documentación. (5%)
- **(100 pts) Muy buen desempeño:** Elabora un informe técnico completo, claro y bien estructurado, que integra evidencia visual y documentación sólida.
- **(80 pts) Buen desempeño:** Elabora un informe técnico bien organizado, con evidencia visual suficiente y respaldo documental pertinente.
- **(60 pts) Desempeño aceptable:** Elabora un informe aceptable, con algunos elementos visuales y documentación parcial.
- **(30 pts) Desempeño incipiente:** Elabora un informe incompleto o poco claro, con escasa evidencia visual o documentación.
- **(0 pts) Desempeño no logrado:** No elabora el informe técnico o lo presenta sin sustento visual o documental.

## 9. IE9. Utiliza en el informe un lenguaje técnico, argumentando sus respuestas con respaldado en evidencias y/o ejemplos concretos. (5%)
- **(100 pts) Muy buen desempeño:** Utiliza lenguaje técnico preciso y adecuado en todo el informe, con argumentación sólida y ejemplos bien seleccionados.
- **(80 pts) Buen desempeño:** Utiliza lenguaje técnico apropiado y argumentos coherentes, con algunos ejemplos relevantes.
- **(60 pts) Desempeño aceptable:** Utiliza lenguaje técnico básico y argumenta sus ideas de manera general, con ejemplos limitados.
- **(30 pts) Desempeño incipiente:** Utiliza lenguaje poco técnico o argumentos débiles, sin evidencias claras.
- **(0 pts) Desempeño no logrado:** No utiliza lenguaje técnico ni presenta argumentación basada en evidencias.
`;

const HACKATHON_SALUD_RUBRIC = `# Rúbrica de Evaluación: Hackathon Desafío Salud - Coach de Bienestar Preventivo

## A. Rigor técnico ML (Total 30 pts)
- **Descripción:** Evalúa la calidad, robustez y explicabilidad del modelo de Machine Learning.
- **Sub-criterios:**
  - **A1. Métrica principal (AUROC en test) (12 pts):**
    - 12 pts: AUROC > 0.80
    - 10 pts: AUROC 0.75-0.79
    - 7 pts: AUROC 0.70-0.74
    - 4 pts: AUROC < 0.70
  - **A2. Calibración (Brier Score en test) (6 pts):**
    - 6 pts: Brier < 0.125
    - 3 pts: Brier 0.13-0.15
    - 1 pt: Brier 0.16-0.18
    - 0 pts: Brier > 0.18
  - **A3. Validación temporal & anti-fuga (6 pts):**
    - 6 pts: Cumple split por ciclo + sin fuga de datos
    - 4 pts: Dudas menores en implementación
    - 2 pts: Errores de fuga o validación
  - **A4. Explicabilidad (drivers locales) (6 pts):**
    - 6 pts: Drivers claros, consistentes con modelo y caso
    - 4 pts: Explicaciones parciales
    - 2 pts: Explicaciones confusas o incorrectas
- **Puntaje (0-100):** Se debe promediar el desempeño en los 4 sub-criterios. 100 pts es un desempeño perfecto en todos.

## B. LLMs, RAG y guardrails (Total 25 pts)
- **Descripción:** Evalúa la correcta implementación y funcionamiento de los componentes de lenguaje natural.
- **Sub-criterios:**
  - **B1. Extractor NL->JSON con validación (8 pts):**
    - 8 pts: 100% JSON válido + rangos/unidades correctos
    - 6 pts: Leves correcciones necesarias
    - 3 pts: Errores frecuentes de validación
  - **B2. Coach con RAG y citas válidas (9 pts):**
    - 9 pts: Todas las recomendaciones con fuentes de /kb
    - 7 pts: Alguna omisión menor de citas
    - 4 pts: Alucinaciones o citas inválidas
  - **B3. Safety & Derivación (8 pts):**
    - 8 pts: Umbrales correctos + lenguaje no-diagnóstico + derivación implementada
    - 5 pts: Implementación parcial
    - 2 pts: Ausente o inadecuado
- **Puntaje (0-100):** Se debe promediar el desempeño en los 3 sub-criterios. 100 pts es un desempeño perfecto en todos.

## C. Producto y UX (Total 25 pts)
- **Descripción:** Evalúa la calidad, funcionalidad y experiencia de usuario de la aplicación final.
- **Sub-criterios:**
  - **C1. App funcional y fluida (10 pts):**
    - 10 pts: Formulario claro + feedback inmediato + manejo de errores + deploy en Spaces
    - 7 pts: Funcional con problemas menores
    - 4 pts: Funcionalidad básica limitada
  - **C2. Export & sharing (5 pts):**
    - 5 pts: PDF descargable + enlace compartible funcional
    - 3 pts: Solo una funcionalidad implementada
    - 1 pt: Implementación deficiente
  - **C3. Claridad para el usuario (10 pts):**
    - 10 pts: Mensajes simples + inclusivos + explicación clara del score + próximos pasos
    - 7 pts: Claridad adecuada con mejoras menores
    - 4 pts: Comunicación confusa o incompleta
- **Puntaje (0-100):** Se debe promediar el desempeño en los 3 sub-criterios. 100 pts es un desempeño perfecto en todos.

## D. Reproducibilidad y buenas prácticas (Total 15 pts)
- **Descripción:** Evalúa la calidad del código, la documentación y la capacidad de reproducir los resultados.
- **Sub-criterios:**
  - **D1. Repo & scripts (6 pts):**
    - 6 pts: requirements.txt/env + Makefile o scripts + semillas fijadas + rutas limpias
    - 4 pts: Reproducible con ajustes menores
    - 2 pts: Dificultades significativas para reproducir
  - **D2. Documentación (5 pts):**
    - 5 pts: README claro con pasos + supuestos + estructura de datos
    - 3 pts: Documentación básica funcional
    - 1 pt: Documentación insuficiente
  - **D3. Métricas por subgrupos (fairness) (4 pts):**
    - 4 pts: Reporte completo por sexo/edad/grupo étnico + análisis de gap + mitigaciones
    - 2 pts: Análisis parcial de equidad
    - 1 pt: Análisis superficial o ausente
- **Puntaje (0-100):** Se debe promediar el desempeño en los 3 sub-criterios. 100 pts es un desempeño perfecto en todos.
`;

const HACKATHON_EDUCACION_RUBRIC = `# Rúbrica de Evaluación: Hackathon Desafío Educación - Tutor Virtual Adaptativo

## A. Rigor técnico ML (Total 30 pts)
- **Descripción:** Evalúa la calidad, robustez y explicabilidad del modelo de Machine Learning.
- **Sub-criterios:**
  - **A1. Métrica principal (AUROC en test) (12 pts):**
    - 12 pts: AUROC > 0.80
    - 10 pts: AUROC 0.75-0.79
    - 7 pts: AUROC 0.70-0.74
    - 4 pts: AUROC < 0.70
  - **A2. Calibración (Brier Score en test) (6 pts):**
    - 6 pts: Brier < 0.125
    - 3 pts: Brier 0.13-0.15
    - 1 pt: Brier 0.16-0.18
    - 0 pts: Brier > 0.18
  - **A3. Validación temporal & anti-fuga (6 pts):**
    - 6 pts: Cumple split por ciclo + sin fuga de datos
    - 4 pts: Dudas menores en implementación
    - 2 pts: Errores de fuga o validación
  - **A4. Explicabilidad (drivers locales) (6 pts):**
    - 6 pts: Drivers claros, consistentes con modelo y caso
    - 4 pts: Explicaciones parciales
    - 2 pts: Explicaciones confusas o incorrectas
- **Puntaje (0-100):** Se debe promediar el desempeño en los 4 sub-criterios. 100 pts es un desempeño perfecto en todos.

## B. LLMs, RAG y guardrails (Total 25 pts)
- **Descripción:** Evalúa la correcta implementación y funcionamiento de los componentes de lenguaje natural.
- **Sub-criterios:**
  - **B1. Extractor NL->JSON con validación (8 pts):**
    - 8 pts: 100% JSON válido + rangos/unidades correctos
    - 6 pts: Leves correcciones necesarias
    - 3 pts: Errores frecuentes de validación
  - **B2. Coach con RAG y citas válidas (9 pts):**
    - 9 pts: Todas las recomendaciones con fuentes de /kb
    - 7 pts: Alguna omisión menor de citas
    - 4 pts: Alucinaciones o citas inválidas
  - **B3. Safety & Derivación (8 pts):**
    - 8 pts: Umbrales correctos + lenguaje no-diagnóstico + derivación implementada
    - 5 pts: Implementación parcial
    - 2 pts: Ausente o inadecuado
- **Puntaje (0-100):** Se debe promediar el desempeño en los 3 sub-criterios. 100 pts es un desempeño perfecto en todos.

## C. Producto y UX (Total 25 pts)
- **Descripción:** Evalúa la calidad, funcionalidad y experiencia de usuario de la aplicación final.
- **Sub-criterios:**
  - **C1. App funcional y fluida (10 pts):**
    - 10 pts: Formulario claro + feedback inmediato + manejo de errores + deploy en Spaces
    - 7 pts: Funcional con problemas menores
    - 4 pts: Funcionalidad básica limitada
  - **C2. Export & sharing (5 pts):**
    - 5 pts: PDF descargable + enlace compartible funcional
    - 3 pts: Solo una funcionalidad implementada
    - 1 pt: Implementación deficiente
  - **C3. Claridad para el usuario (10 pts):**
    - 10 pts: Mensajes simples + inclusivos + explicación clara del score + próximos pasos
    - 7 pts: Claridad adecuada con mejoras menores
    - 4 pts: Comunicación confusa o incompleta
- **Puntaje (0-100):** Se debe promediar el desempeño en los 3 sub-criterios. 100 pts es un desempeño perfecto en todos.

## D. Reproducibilidad y buenas prácticas (Total 15 pts)
- **Descripción:** Evalúa la calidad del código, la documentación y la capacidad de reproducir los resultados.
- **Sub-criterios:**
  - **D1. Repo & scripts (6 pts):**
    - 6 pts: requirements.txt/env + Makefile o scripts + semillas fijadas + rutas limpias
    - 4 pts: Reproducible con ajustes menores
    - 2 pts: Dificultades significativas para reproducir
  - **D2. Documentación (5 pts):**
    - 5 pts: README claro con pasos + supuestos + estructura de datos
    - 3 pts: Documentación básica funcional
    - 1 pt: Documentación insuficiente
  - **D3. Métricas por subgrupos (fairness) (4 pts):**
    - 4 pts: Reporte completo por sexo/edad/grupo étnico + análisis de gap + mitigaciones
    - 2 pts: Análisis parcial de equidad
    - 1 pt: Análisis superficial o ausente
- **Puntaje (0-100):** Se debe promediar el desempeño en los 3 sub-criterios. 100 pts es un desempeño perfecto en todos.
`;

const HACKATHON_CIUDADES_RUBRIC = `# Rúbrica de Evaluación: Hackathon Desafío Ciudades - Optimizador de Rutas

## A. Rigor técnico ML (Total 30 pts)
- **Descripción:** Evalúa la calidad, robustez y explicabilidad del modelo de Machine Learning.
- **Sub-criterios:**
  - **A1. Métrica principal (AUROC en test) (12 pts):**
    - 12 pts: AUROC > 0.80
    - 10 pts: AUROC 0.75-0.79
    - 7 pts: AUROC 0.70-0.74
    - 4 pts: AUROC < 0.70
  - **A2. Calibración (Brier Score en test) (6 pts):**
    - 6 pts: Brier < 0.125
    - 3 pts: Brier 0.13-0.15
    - 1 pt: Brier 0.16-0.18
    - 0 pts: Brier > 0.18
  - **A3. Validación temporal & anti-fuga (6 pts):**
    - 6 pts: Cumple split por ciclo + sin fuga de datos
    - 4 pts: Dudas menores en implementación
    - 2 pts: Errores de fuga o validación
  - **A4. Explicabilidad (drivers locales) (6 pts):**
    - 6 pts: Drivers claros, consistentes con modelo y caso
    - 4 pts: Explicaciones parciales
    - 2 pts: Explicaciones confusas o incorrectas
- **Puntaje (0-100):** Se debe promediar el desempeño en los 4 sub-criterios. 100 pts es un desempeño perfecto en todos.

## B. LLMs, RAG y guardrails (Total 25 pts)
- **Descripción:** Evalúa la correcta implementación y funcionamiento de los componentes de lenguaje natural.
- **Sub-criterios:**
  - **B1. Extractor NL->JSON con validación (8 pts):**
    - 8 pts: 100% JSON válido + rangos/unidades correctos
    - 6 pts: Leves correcciones necesarias
    - 3 pts: Errores frecuentes de validación
  - **B2. Coach con RAG y citas válidas (9 pts):**
    - 9 pts: Todas las recomendaciones con fuentes de /kb
    - 7 pts: Alguna omisión menor de citas
    - 4 pts: Alucinaciones o citas inválidas
  - **B3. Safety & Derivación (8 pts):**
    - 8 pts: Umbrales correctos + lenguaje no-diagnóstico + derivación implementada
    - 5 pts: Implementación parcial
    - 2 pts: Ausente o inadecuado
- **Puntaje (0-100):** Se debe promediar el desempeño en los 3 sub-criterios. 100 pts es un desempeño perfecto en todos.

## C. Producto y UX (Total 25 pts)
- **Descripción:** Evalúa la calidad, funcionalidad y experiencia de usuario de la aplicación final.
- **Sub-criterios:**
  - **C1. App funcional y fluida (10 pts):**
    - 10 pts: Formulario claro + feedback inmediato + manejo de errores + deploy en Spaces
    - 7 pts: Funcional con problemas menores
    - 4 pts: Funcionalidad básica limitada
  - **C2. Export & sharing (5 pts):**
    - 5 pts: PDF descargable + enlace compartible funcional
    - 3 pts: Solo una funcionalidad implementada
    - 1 pt: Implementación deficiente
  - **C3. Claridad para el usuario (10 pts):**
    - 10 pts: Mensajes simples + inclusivos + explicación clara del score + próximos pasos
    - 7 pts: Claridad adecuada con mejoras menores
    - 4 pts: Comunicación confusa o incompleta
- **Puntaje (0-100):** Se debe promediar el desempeño en los 3 sub-criterios. 100 pts es un desempeño perfecto en todos.

## D. Reproducibilidad y buenas prácticas (Total 15 pts)
- **Descripción:** Evalúa la calidad del código, la documentación y la capacidad de reproducir los resultados.
- **Sub-criterios:**
  - **D1. Repo & scripts (6 pts):**
    - 6 pts: requirements.txt/env + Makefile o scripts + semillas fijadas + rutas limpias
    - 4 pts: Reproducible con ajustes menores
    - 2 pts: Dificultades significativas para reproducir
  - **D2. Documentación (5 pts):**
    - 5 pts: README claro con pasos + supuestos + estructura de datos
    - 3 pts: Documentación básica funcional
    - 1 pt: Documentación insuficiente
  - **D3. Métricas por subgrupos (fairness) (4 pts):**
    - 4 pts: Reporte completo por sexo/edad/grupo étnico + análisis de gap + mitigaciones
    - 2 pts: Análisis parcial de equidad
    - 1 pt: Análisis superficial o ausente
- **Puntaje (0-100):** Se debe promediar el desempeño en los 3 sub-criterios. 100 pts es un desempeño perfecto en todos.
`;


export const PREDEFINED_RUBRICS = [
  { name: 'Proyecto ML con Kedro', content: KEDRO_RUBRIC },
  { name: 'ML Pipelines (Kedro, DVC, Airflow)', content: ML_PIPELINES_DVC_AIRFLOW_RUBRIC },
  { name: 'Solución con LLM y RAG', content: RAG_LLM_RUBRIC },
  { name: 'Desarrollo de Agente Funcional', content: AGENT_FUNCIONAL_RUBRIC },
  { name: 'Evaluación 3: Observabilidad', content: OBSERVABILITY_RUBRIC },
  { name: 'Hackathon: Desafío Salud', content: HACKATHON_SALUD_RUBRIC },
  { name: 'Hackathon: Desafío Educación', content: HACKATHON_EDUCACION_RUBRIC },
  { name: 'Hackathon: Desafío Ciudades', content: HACKATHON_CIUDADES_RUBRIC },
];

export const DEFAULT_RUBRIC = PREDEFINED_RUBRICS[0].content;
