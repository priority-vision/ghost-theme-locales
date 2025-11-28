/**
 * Extracts translatable strings from Ghost theme file content.
 * Finds strings wrapped in Ghost's translation helper patterns like:
 * - `{{t "string"}}` / `{{~t "string"~}}`
 * - `{{{t "string"}}}` / `{{{~t "string"~}}}`
 * - `(t "string")`
 *
 * @param fileContent - The content of a Ghost theme template file
 * @returns An array of unique translatable strings found in the content
 *
 * @example
 * ```js
 * import { extractTranslatableStrings } from 'ghost-theme-locales';
 *
 * const strings = extractTranslatableStrings('{{t "Hello World"}} {{t "Goodbye"}}');
 * // => ['Hello World', 'Goodbye']
 * ```
 */
export default function extractTranslatableStrings(fileContent: string): string[];
