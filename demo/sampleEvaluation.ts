import type { EvaluationResult } from '../types';
import { calculateChileanGrade } from '../utils/gradingScales';

/** Nombre que se muestra en el informe del modo demo. */
export const DEMO_REPO_NAME = 'proyecto-ejemplo-kedro (demo)';

/**
 * Evaluación de ejemplo para el modo demo. Es un caso ficticio escrito a mano:
 * no corresponde a ninguna entrega real ni fue generado por Gemini en vivo.
 * Sirve para mostrar el informe sin necesidad de una clave de API.
 */
const report: EvaluationResult['report'] = [
    { criterion: "1. Estructura y Configuración del Proyecto Kedro (10%)", score: 90, feedback: "**Fortalezas:** el proyecto respeta la plantilla de Kedro, con `conf/base` y `conf/local` bien separados y `pyproject.toml` completo.\n\n**A mejorar:** `parameters.yml` mezcla parámetros de limpieza y de modelado; sepáralos por pipeline." },
    { criterion: "2. Implementación del Catálogo de Datos (10%)", score: 80, feedback: "**Fortalezas:** los tres datasets crudos y los intermedios están declarados en `catalog.yml` con tipos correctos.\n\n**A mejorar:** faltan los datasets de `05_model_input`; hoy se guardan desde un notebook y no quedan versionados." },
    { criterion: "3. Desarrollo de Nodos y Funciones (10%)", score: 70, feedback: "**Fortalezas:** funciones puras, con nombres claros y *type hints*.\n\n**A mejorar:** `limpiar_ventas` hace cuatro cosas distintas en 80 líneas. Divídela y agrega *docstrings*." },
    { criterion: "4. Construcción de Pipelines (10%)", score: 80, feedback: "**Fortalezas:** dos pipelines registrados (`data_engineering` y `feature_engineering`) con entradas y salidas bien encadenadas.\n\n**A mejorar:** no hay *tags* ni *namespaces*, así que no se puede ejecutar una etapa por separado." },
    { criterion: "5. Análisis Exploratorio de Datos - EDA (10%)", score: 90, feedback: "**Fortalezas:** EDA completo: distribuciones, correlaciones y análisis de nulos, cada gráfico con su interpretación.\n\n**A mejorar:** falta revisar valores atípicos en `monto`." },
    { criterion: "6. Limpieza y Tratamiento de Datos (10%)", score: 70, feedback: "**Fortalezas:** la imputación está justificada por columna.\n\n**A mejorar:** los duplicados se eliminan sin reportar cuántos eran, y las fechas se convierten sin validar el formato." },
    { criterion: "7. Transformación y Feature Engineering (10%)", score: 60, feedback: "**Fortalezas:** las variables de fecha derivadas (mes, día de la semana) tienen sentido para el problema.\n\n**A mejorar:** el escalado se ajusta con todo el conjunto antes de separar entrenamiento y prueba: hay fuga de información." },
    { criterion: "8. Identificación de Targets para ML (10%)", score: 80, feedback: "**Fortalezas:** el *target* de clasificación y el de regresión están definidos y justificados desde el negocio.\n\n**A mejorar:** no se analiza el desbalance de clases." },
    { criterion: "9. Documentación y Notebooks (10%)", score: 70, feedback: "**Fortalezas:** el README explica cómo instalar y ejecutar.\n\n**A mejorar:** los notebooks no tienen conclusiones y dos de ellos fallan al ejecutarse desde cero." },
    { criterion: "10. Reproducibilidad y Mejores Prácticas (10%)", score: 60, feedback: "**Fortalezas:** dependencias fijadas y `.gitignore` correcto.\n\n**A mejorar:** no hay pruebas y `kedro run` falla en limpio porque falta un archivo de datos que no está documentado." },
];

const overallScore = report.reduce((acc, item) => acc + item.score, 0) / report.length;

export const SAMPLE_EVALUATION: EvaluationResult = {
  overallScore,
  finalChileanGrade: calculateChileanGrade(overallScore, 60),
  summary:
    'Proyecto Kedro bien estructurado, con un análisis exploratorio sólido y pipelines que se encadenan correctamente. Los puntos débiles están en la reproducibilidad (no corre en limpio y no tiene pruebas) y en una fuga de información en el escalado de variables.',
  professionalismSummary:
    'Código legible y ordenado, con commits descriptivos. Para un estándar profesional faltan pruebas automáticas, *docstrings* y notebooks que se ejecuten de principio a fin.',
  report,
};
