import fs from 'fs';
import os from 'os';
import path from 'path';

const originalCwd = process.cwd();

/** @type {string[]} */
const tempDirectories = [];

export function cleanupTempThemes() {
	process.chdir(originalCwd);

	for (const tempDirectory of tempDirectories.splice(0)) {
		fs.rmSync(tempDirectory, { recursive: true, force: true });
	}
}

/**
 * @param {Record<string, string>} files
 */
export function createTempTheme(files) {
	const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'gtl-'));
	tempDirectories.push(tempDirectory);

	for (const [relativePath, content] of Object.entries(files)) {
		const filePath = path.join(tempDirectory, relativePath);
		fs.mkdirSync(path.dirname(filePath), { recursive: true });
		fs.writeFileSync(filePath, content);
	}

	return tempDirectory;
}
