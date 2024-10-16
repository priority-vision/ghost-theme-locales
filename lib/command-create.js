import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import chalk from 'chalk';
import ora from 'ora';

import extractTranslatableStrings from './extract-translatable-strings.js';

export default async function create(cli) {
	const { language, forceRewrite } = cli.flags;

	const spinner = ora({
		text: 'Generating locales...',
		color: 'green',
		spinner: 'dots',
	}).start();

	const files = await glob('**/*.hbs', { ignore: 'node_modules/**', cwd: process.cwd() });

	// Find locales in files.
	const newLocales = {};
	files.forEach(file => {
		const content = fs.readFileSync(file, 'utf8');

		const strings = extractTranslatableStrings(content);

		strings.forEach(string => {
			if (!newLocales[string]) {
				newLocales[string] = string;
			}
		});
	});

	if (Object.keys(newLocales).length === 0) {
		spinner.stop();
		console.log(chalk.red('gtl: ❌ No locale strings found.'));
		return;
	}

	// Write locales to file, ensuring the directory exists.
	const localesDir = path.join(process.cwd(), 'locales');
	const filePath = path.join(localesDir, language + '.json');
	let existingLocales = {};

	if (!fs.existsSync(localesDir)) {
		fs.mkdirSync(localesDir, { recursive: true });
	}

	// Check if the file already exists and read its content
	if (fs.existsSync(filePath)) {
		const existingContent = fs.readFileSync(filePath, 'utf8');

		try {
			existingLocales = JSON.parse(existingContent);
		} catch (error) {
			// Reset to an empty object if parsing fails.
			existingLocales = {};
		}
	}

	// Count new strings
	let newCount = 0;

	for (const string of Object.keys(newLocales)) {
		if (!existingLocales[string]) {
			newCount++;
		}
	}

	if (newCount === 0 && !forceRewrite) {
		spinner.stop();
		console.log(chalk.green('gtl: ⏭️  No new locale strings found. File will not be rewritten.'));
		return;
	}

	// Write locales to file.
	const json = JSON.stringify(newLocales, null, 2);
	fs.writeFileSync(filePath, json);

	spinner.stop();
	console.log(chalk.green('gtl: ✅ Locales in ') + chalk.cyan(`locales/${language}.json`) + chalk.green(' generated successfully!'));
	console.log(chalk.green('gtl: Total strings: ') + chalk.cyan(Object.keys(newLocales).length));
	console.log(chalk.green('gtl: New strings: ') + chalk[newCount ? 'cyan' : 'red'](newCount));
}
