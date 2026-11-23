# AI Code Reviewer — Asistente de IA para evaluación de código con rúbrica

> **English summary.** Web app that grades student code with AI against a rubric. It ingests work from a GitHub repository or a ZIP/RAR file, evaluates it with Google Gemini, and returns per-criterion scores, actionable feedback and a final grade on the Chilean 1.0–7.0 scale, exportable to PDF. React 19 + TypeScript + Vite. It automates the first grading pass; the instructor reviews the result. The rest of this document is in Spanish.

Aplicación web que **evalúa entregas de código de estudiantes con IA**: ingesta el trabajo desde un repositorio de GitHub o un archivo comprimido, lo analiza contra una **rúbrica**, y entrega puntaje por criterio, retroalimentación accionable y **nota final en escala chilena (1.0–7.0)**. Reduce la carga de corrección del docente y estandariza la retroalimentación.

[![CI](https://github.com/Giocrisrai/teaching_assistant_in_code_review/actions/workflows/ci.yml/badge.svg)](https://github.com/Giocrisrai/teaching_assistant_in_code_review/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)

---

## Qué resuelve

Corregir código a mano —repo por repo, alumno por alumno— es lento y poco consistente. Esta herramienta automatiza la primera pasada de evaluación: aplica la misma rúbrica a todas las entregas, entrega retroalimentación personalizada y calcula la nota en la escala chilena con el nivel de exigencia configurable. El docente revisa y ajusta, en vez de partir de cero.

## Qué hace

- **Ingesta multi-fuente** — evalúa desde un **repositorio de GitHub** (vía API) o un **archivo comprimido** (ZIP/RAR) subido.
- **Evaluación con rúbrica** — analiza el código con **Google Gemini** contra los criterios que definas.
- **Soporta notebooks** — parsea Jupyter (`.ipynb`), además de código y PDF.
- **Nota en escala chilena** — calcula la nota 1.0–7.0 con exigencia configurable (60% / 50%).
- **Informe descargable** — puntaje por criterio, resumen, evaluación de profesionalismo y feedback, exportable a **PDF**.

## Arquitectura

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Motor de IA | Google Gemini (`@google/genai`) |
| Ingesta | GitHub API · JSZip (ZIP) · descompresión RAR · pdf.js (PDF) |
| Salida | Informe en pantalla + exportación a PDF (jsPDF) |

```
├── App.tsx                 # Aplicación principal
├── components/             # UI (formularios, informe, resultados)
├── hooks/                  # Hook de análisis (orquesta la evaluación)
├── services/
│   ├── geminiService.ts    # Evaluación con Gemini contra la rúbrica
│   ├── githubService.ts    # Ingesta de repositorios de GitHub
│   ├── zipService.ts       # Ingesta de ZIP
│   └── rarService.ts       # Ingesta de RAR
└── types.ts                # Modelo (EvaluationResult, rúbrica, escala)
```

## Inicio rápido

**Requisitos:** Node.js + una API key de Google Gemini.

```bash
npm install
# Define GEMINI_API_KEY en .env.local
npm run dev
```

## Contexto

Prototipo independiente que explora la **IA generativa aplicada a la evaluación educativa** — una de mis líneas de investigación aplicada (IA para educación). Construido con Google Gemini para demostrar un pipeline de corrección automática multi-fuente con retroalimentación efectiva.

## Autor

👤 **Giocrisrai Godoy Bonillo** — AI Engineer · IA aplicada a educación e investigación
· [giocrisrai.com](https://giocrisrai.com) · [github.com/Giocrisrai](https://github.com/Giocrisrai) · [linkedin.com/in/giocrisrai](https://www.linkedin.com/in/giocrisrai)

## Pruebas

La lógica que decide la nota tiene pruebas automáticas: el cálculo de la escala chilena (60 %, 50 % y proporcional), la lectura de criterios de la rúbrica y el formateo de notebooks. No llaman a Gemini ni necesitan clave.

```bash
pnpm install
pnpm test        # 20 pruebas con Vitest
pnpm typecheck   # tipos de TypeScript
```

## Nota de seguridad

La clave de Gemini se inyecta en el bundle del navegador en tiempo de compilación (`vite.config.ts`). Eso sirve para uso local o en una red de confianza. **No publiques esta aplicación en internet con tu clave**: cualquiera podría extraerla. Para un despliegue público, mueve la llamada a Gemini a un backend que guarde la clave.
