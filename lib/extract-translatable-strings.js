export default function extractTranslatableStrings(fileContent) {
	const patterns = [
		/{{t\s*(["'])((?:\\.|(?:(?!\1)).)*?)\1(?:\s+[^}]+)?}}/g,
		/{{{t\s*(["'])((?:\\.|(?:(?!\1)).)*?)\1(?:\s+[^}]+)?}}}/g,
		/\(t\s*(["'])((?:\\.|(?:(?!\1)).)*?)\1\)/g
	];

	const translatableStrings = [];

	patterns.forEach(pattern => {
		let match;
		while ((match = pattern.exec(fileContent)) !== null) {
			const quoteType = match[1];
			let capturedString = match[2];

			// Unescape the string based on the quote type used
			if (quoteType === '"') {
				capturedString = capturedString.replace(/\\"/g, '"');
			} else {
				capturedString = capturedString.replace(/\\'/g, "'");
			}

			// Check if the string already exists in the array
			if (!translatableStrings.includes(capturedString)) {
				translatableStrings.push(capturedString);
			}
		}
	});

	return translatableStrings;
}
