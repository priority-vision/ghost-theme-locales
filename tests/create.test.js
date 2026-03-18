import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { afterEach, describe, expect, it } from 'vitest';

import create from '../lib/command-create.js';
import mergeLocales from '../lib/merge-locales.js';
import { cleanupTempThemes, createTempTheme } from './helpers.js';

const cliPath = path.resolve(process.cwd(), 'cli.js');

afterEach(() => {
	cleanupTempThemes();
});

describe('mergeLocales', () => {
	it('keeps existing translations and counts only genuinely new keys', () => {
		const result = mergeLocales(
			{ Hello: 'Hello', World: 'World' },
			{ Hello: 'Bonjour', Unused: 'Unused' }
		);

		expect(result).toEqual({
			mergedLocales: {
				Hello: 'Bonjour',
				World: 'World'
			},
			newCount: 1
		});
	});
});

describe('create', () => {
	it('preserves existing translations while adding new keys', async () => {
		const themeDirectory = createTempTheme({
			'index.hbs': '{{t "Hello"}} {{t "World"}}',
			'locales/fr.json': JSON.stringify({ Hello: 'Bonjour' }, null, 2)
		});

		process.chdir(themeDirectory);

		await create({
			flags: {
				language: 'fr',
				forceRewrite: false
			}
		});

		const locales = JSON.parse(fs.readFileSync(path.join(themeDirectory, 'locales/fr.json'), 'utf8'));
		expect(locales).toEqual({
			Hello: 'Bonjour',
			World: 'World'
		});
	});

	it('does not rewrite locale file when there are no new strings and forceRewrite is disabled', async () => {
		const themeDirectory = createTempTheme({
			'index.hbs': '{{t "Hello"}}',
			'locales/en.json': JSON.stringify({ Hello: 'Hello' }, null, 2)
		});

		const localePath = path.join(themeDirectory, 'locales/en.json');
		const originalContent = fs.readFileSync(localePath, 'utf8');

		process.chdir(themeDirectory);

		await create({
			flags: {
				language: 'en',
				forceRewrite: false
			}
		});

		expect(fs.readFileSync(localePath, 'utf8')).toBe(originalContent);
	});

	it('rewrites locale file with preserved translations when forceRewrite is enabled', async () => {
		const themeDirectory = createTempTheme({
			'index.hbs': '{{t "Hello"}} {{t "World"}}',
			'locales/en.json': JSON.stringify({ Hello: 'Hello translated' }, null, 2)
		});

		process.chdir(themeDirectory);

		await create({
			flags: {
				language: 'en',
				forceRewrite: true
			}
		});

		const locales = JSON.parse(fs.readFileSync(path.join(themeDirectory, 'locales/en.json'), 'utf8'));
		expect(locales).toEqual({
			Hello: 'Hello translated',
			World: 'World'
		});
	});

	it('rebuilds locale file from scratch when existing JSON is invalid', async () => {
		const themeDirectory = createTempTheme({
			'index.hbs': '{{t "Hello"}} {{t "World"}}',
			'locales/en.json': '{not valid json'
		});

		process.chdir(themeDirectory);

		await create({
			flags: {
				language: 'en',
				forceRewrite: false
			}
		});

		const locales = JSON.parse(fs.readFileSync(path.join(themeDirectory, 'locales/en.json'), 'utf8'));
		expect(locales).toEqual({
			Hello: 'Hello',
			World: 'World'
		});
	});

	it('does not create locale files when no translation strings are found', async () => {
		const themeDirectory = createTempTheme({
			'index.hbs': '<h1>No translations here</h1>'
		});

		process.chdir(themeDirectory);

		await create({
			flags: {
				language: 'en',
				forceRewrite: false
			}
		});

		expect(fs.existsSync(path.join(themeDirectory, 'locales/en.json'))).toBe(false);
	});
});

describe('cli', () => {
	it('supports the create command and writes the requested language file', () => {
		const themeDirectory = createTempTheme({
			'index.hbs': '{{t "Hello"}}'
		});

		execFileSync(process.execPath, [cliPath, 'create', '--language', 'fr'], {
			cwd: themeDirectory,
			encoding: 'utf8'
		});

		const locales = JSON.parse(fs.readFileSync(path.join(themeDirectory, 'locales/fr.json'), 'utf8'));
		expect(locales).toEqual({ Hello: 'Hello' });
	});

	it('supports the c alias and forceRewrite flag', () => {
		const themeDirectory = createTempTheme({
			'index.hbs': '{{t "Hello"}}',
			'locales/en.json': JSON.stringify({ Hello: 'Translated hello' }, null, 2)
		});

		execFileSync(process.execPath, [cliPath, 'c', '-f'], {
			cwd: themeDirectory,
			encoding: 'utf8'
		});

		const locales = JSON.parse(fs.readFileSync(path.join(themeDirectory, 'locales/en.json'), 'utf8'));
		expect(locales).toEqual({ Hello: 'Translated hello' });
	});
});
