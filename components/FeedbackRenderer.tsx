import React from 'react';

interface FeedbackRendererProps {
  text: string;
}

// Regex to find:
// 1. Multiline code blocks (```...```) with optional language hint.
// 2. Inline code snippets (`...`).
// 3. File or directory paths.
// 4. File names with common extensions.
const codeRegex = /(```(?:[a-z]+\n)?[\s\S]*?```|`[^`]+`|\b[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_./-]*\b|\b[a-zA-Z_][a-zA-Z0-9_]*\.(py|yml|md|txt|ipynb|cfg)\b)/g;


export const FeedbackRenderer: React.FC<FeedbackRendererProps> = ({ text }) => {
  if (!text) {
    return null;
  }

  const parts = text.split(codeRegex);

  return (
    <>
      {parts.map((part, index) => {
        if (part && part.match(codeRegex)) {
          // It's a code part
          if (part.startsWith('```')) {
            // Multiline code block
            const codeContent = part.replace(/^```[a-z]*\n?|```$/g, '');
            return (
              <pre key={index} className="bg-black/40 text-gray-300 p-3 my-2 rounded-md font-mono text-sm overflow-x-auto">
                <code>{codeContent}</code>
              </pre>
            );
          } else {
            // Inline code or file path
            const cleanPart = part.replace(/`/g, '');
            return (
              <code 
                key={index} 
                className="bg-cyan-900/50 text-cyan-300 px-1.5 py-0.5 rounded-md font-semibold"
              >
                {cleanPart}
              </code>
            );
          }
        }
        // It's a regular text part
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};
