// FIX: Implement a utility function to parse the rubric text.
// This is used for validation before calling the API.

/**
 * Parses a markdown rubric to extract the main criteria titles.
 * Criteria are expected to be H2 markdown headers (e.g., "## 1. Criterio...").
 * @param rubricText The full text of the rubric.
 * @returns An array of strings, where each string is a criterion title.
 */
export function getCriteriaFromRubric(rubricText: string): string[] {
    if (!rubricText) {
        return [];
    }
    
    // This regex looks for lines starting with '##' (markdown H2), followed by a space,
    // and captures the rest of the line as the criterion title.
    const criteriaRegex = /^##\s.*$/gm;
    const matches = rubricText.match(criteriaRegex);

    if (!matches) {
        return [];
    }

    // Clean up the matched strings by removing the leading '## '
    return matches.map(match => match.replace(/^##\s+/, '').trim());
}
