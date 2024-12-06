export default function extractTranslatableStrings(fileContent) {
	const patterns = [
        // Handle {{t "Hello"}}, {{~t "Hello"}}, {{t "Hello"~}}, {{~t "Hello"~}}
        /{{~?t\s*(["'])((?:\\.|(?:(?!\1)).)*?)\1(?:\s+[^}]+)?~?}}/g,

        // Handle {{{t "Hello"}}}, {{{~t "Hello"}}}, {{{t "Hello"~}}}, {{{~t "Hello"~}}}
        /{{{~?t\s*(["'])((?:\\.|(?:(?!\1)).)*?)\1(?:\s+[^}]+)?~?}}}/g,

        // Handle (t "Hello")
        /\(t\s*(["'])((?:\\.|(?:(?!\1)).)*?)\1\)/g,
        /\(t\s*(["'])((?:\\.|(?:(?!\1)).)*?)\1\s+[^)]+\)/g
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
