#!/usr/bin/env node
import meow from 'meow';

import create from './lib/command-create.js';

const cli = meow(`
	Usage
	  $ gtl c [options]

	Options
	  --language, -l  Language code (default: en)
	  --forceRewrite, -f  Force rewrite existing locales file even if it has no new strings
`, {
	importMeta: import.meta,
	flags: {
		language: {
			type: 'string',
			shortFlag: 'l',
			default: 'en'
		},
		forceRewrite: {
			type: 'boolean',
			shortFlag: 'f',
			default: false
		}
	}
});

if (cli.input.at(0) === 'create' || cli.input.at(0) === 'c') {
	create(cli);
}
