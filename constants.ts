// FIX: The original file was plain text, not a valid TypeScript module.
// This wraps the rubric text in a template string and exports it as a constant.
export const DEFAULT_RUBRIC = `# Rúbrica de Evaluación de Proyecto de Software (Nivel Universitario - 3er Año)

## 1. Funcionalidad y Correctitud (30%)
- **(30 pts) Excelente:** El programa cumple con todos los requisitos funcionales. Es robusto, maneja correctamente todos los casos borde y no tiene errores observables.
- **(20 pts) Bueno:** El programa cumple con los requisitos principales y la funcionalidad central es correcta. Puede tener algunos bugs menores o no manejar todos los casos borde de forma ideal.
- **(10 pts) Suficiente:** El programa se ejecuta pero tiene errores significativos que afectan su funcionalidad principal o no cumple con varios requisitos.
- **(0 pts) Insuficiente:** El programa no se ejecuta, tiene errores críticos que impiden su uso o no cumple con los requisitos básicos.

## 2. Calidad y Estructura del Código (30%)
- **(30 pts) Excelente:** El código demuestra un entendimiento avanzado. El proyecto sigue una estructura de directorios convencional y escalable. El código está organizado lógicamente en módulos/clases que aplican principios de diseño como SOLID, promoviendo una arquitectura desacoplada y mantenible. Es altamente legible y sigue consistentemente las guías de estilo.
- **(20 pts) Bueno:** El código está bien organizado, es legible y sigue las guías de estilo. Las funciones y módulos tienen una responsabilidad clara. Es un código limpio y mantenible que cumple con un buen estándar profesional para un estudiante.
- **(10 pts) Suficiente:** El código funciona pero tiene problemas de estructura. Puede estar desorganizado (ej. lógica mezclada, todo en un solo archivo), ser difícil de leer o inconsistente en su estilo.
- **(0 pts) Insuficiente:** El código es caótico, ilegible y no sigue ninguna buena práctica de estructuración.

## 3. Documentación y Comentarios (20%)
- **(20 pts) Excelente:** El proyecto incluye un archivo \`README.md\` ejemplar que explica el propósito, cómo instalar dependencias y cómo ejecutarlo de forma clara. El código tiene docstrings y comentarios útiles que explican el "porqué" de las decisiones complejas.
- **(10 pts) Bueno:** La documentación es adecuada. Existe un \`README.md\` con las instrucciones básicas y el código tiene comentarios donde es necesario. Cumple con los requisitos para que otra persona entienda y ejecute el proyecto.
- **(5 pts) Suficiente:** La documentación es escasa o incompleta. El \`README.md\` es muy básico o los comentarios son mínimos.
- **(0 pts) Insuficiente:** No hay documentación o es completamente inútil.

## 4. Buenas Prácticas y Profesionalismo (20%)
- **(20 pts) Excelente:** Se aplican consistentemente las mejores prácticas. Se utiliza un archivo de gestión de dependencias (ej. \`requirements.txt\`, \`package.json\`). Se utiliza un archivo \`.gitignore\` completo y adecuado. No hay archivos sensibles (como \`.env\` o claves) subidos al repositorio. El historial de commits es limpio y descriptivo.
- **(10 pts) Bueno:** Se aplican las prácticas esenciales. Existe un gestor de dependencias y un \`.gitignore\`. No se suben archivos sensibles. El historial de commits puede ser mejorable pero es funcional.
- **(5 pts) Suficiente:** Uso inconsistente de buenas prácticas. Faltan elementos importantes como un \`.gitignore\` bien configurado o la gestión de dependencias no es ideal.
- **(0 pts) Insuficiente:** Malas prácticas evidentes. Presencia de archivos sensibles en el repositorio (falta grave), no se gestionan dependencias, se suben archivos generados o binarios.
`;