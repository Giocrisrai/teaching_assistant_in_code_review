import React, { useMemo } from 'react';
import { renderFeedbackHtml } from '../utils/feedbackHtml';

interface FeedbackRendererProps {
  text: string;
}

/**
 * Renders the AI's Markdown feedback as sanitised HTML.
 * It relies on the parent component to provide Tailwind's 'prose' classes for styling.
 */
export const FeedbackRenderer: React.FC<FeedbackRendererProps> = ({ text }) => {
  // Memoize the HTML to avoid re-parsing on every render unless the text changes.
  const safeHtml = useMemo(() => renderFeedbackHtml(text), [text]);

  // Safe to inject: `renderFeedbackHtml` sanitises the model output.
  return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />;
};
