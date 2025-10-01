// FIX: The original file was plain text, not a valid TypeScript module.
// This wraps the rubric text in a template string and exports it as a constant.
export const DEFAULT_RUBRIC = `# Rúbrica de Evaluación: Proyecto Machine Learning con Kedro (Nivel Universitario - 3er Año)

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