/** @typedef {Record<string, string>} LocaleMap */

/**
 * @param {LocaleMap} extractedLocales
 * @param {LocaleMap} existingLocales
 * @returns {{mergedLocales: LocaleMap, newCount: number}}
 */
export default function mergeLocales(extractedLocales, existingLocales) {
	/** @type {LocaleMap} */
	const mergedLocales = {};
	let newCount = 0;

	for (const string of Object.keys(extractedLocales)) {
		if (!(string in existingLocales)) {
			newCount++;
		}

		mergedLocales[string] = existingLocales[string] ?? string;
	}

	return {
		mergedLocales,
		newCount
	};
}
