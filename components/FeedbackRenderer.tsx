import React, { useMemo } from 'react';
import { marked } from 'marked';

interface FeedbackRendererProps {
  text: string;
}

/**
 * A component that safely parses Markdown text from the AI and renders it as HTML.
 * It relies on the parent component to provide Tailwind's 'prose' classes for styling.
 */
export const FeedbackRenderer: React.FC<FeedbackRendererProps> = ({ text }) => {
  // Memoize the parsed HTML to avoid re-parsing on every render unless the text changes.
  const parsedHtml = useMemo(() => {
    if (!text) return '';
    // Use marked to convert the Markdown string into an HTML string.
    // This is safer and more robust than manual regex parsing.
    return marked.parse(text) as string;
  }, [text]);

  // Render the generated HTML. The parent's `prose` classes will style the p, ul, li, code, etc.
  return <div dangerouslySetInnerHTML={{ __html: parsedHtml }} />;
};
