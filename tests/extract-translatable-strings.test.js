import { describe, expect, it } from 'vitest';

import extractTranslatableStrings from '../lib/extract-translatable-strings.js';

describe('extractTranslatableStrings', () => {
	it('handles brackets', () => {
		expect(
			extractTranslatableStrings(`
				This is a test {{t "Hello"}} and another {{t "World"}}
			`)
		).toEqual(['Hello', 'World']);

		expect(
			extractTranslatableStrings(`
				This is a test {{{t "Hello"}}} and another {{{t "World"}}}
			`)
		).toEqual(['Hello', 'World']);

		expect(
			extractTranslatableStrings(`
				This is a test {{t 'Hello'}} and another {{t 'World'}}
			`)
		).toEqual(['Hello', 'World']);

		expect(
			extractTranslatableStrings(`
				This is a test {{{t 'Hello'}}} and another {{{t 'World'}}}
			`)
		).toEqual(['Hello', 'World']);
	});

	it('handles brackets with tilde', () => {
		expect(
			extractTranslatableStrings(`
				{{~t "This is"}} a test {{t "Hello"~}} and another {{~t "World"~}}
			`)
		).toEqual(['This is', 'Hello', 'World']);

		expect(
			extractTranslatableStrings(`
				{{{~t "This is"}}} a test {{{t "Hello"~}}} and another {{{~t "World"~}}}
			`)
		).toEqual(['This is', 'Hello', 'World']);

		expect(
			extractTranslatableStrings(`
				{{~t 'This is'}} a test {{t 'Hello'~}} and another {{~t 'World'~}}
			`)
		).toEqual(['This is', 'Hello', 'World']);

		expect(
			extractTranslatableStrings(`
				{{{~t 'This is'}}} a test {{{t 'Hello'~}}} and another {{{~t 'World'~}}}
			`)
		).toEqual(['This is', 'Hello', 'World']);
	});

	it('handles parentheses', () => {
		expect(
			extractTranslatableStrings(`
				This is a test (t "Hello") and another (t "World")
			`)
		).toEqual(['Hello', 'World']);

		expect(
			extractTranslatableStrings(`
				{{> "components/image" size="32" alt=(t 'Hello {tag}' tag=name)}}
				(t 'World {tag}' tag='test')
			`)
		).toEqual(['Hello {tag}', 'World {tag}']);

		expect(
			extractTranslatableStrings(`
				This is a test (t 'Hello') and another (t 'World')
			`)
		).toEqual(['Hello', 'World']);

		expect(
			extractTranslatableStrings(`
				{{> "components/image" size="32" alt=(t "Hello {tag}" tag=name)}}
				(t "World {tag}" tag="test")
			`)
		).toEqual(['Hello {tag}', 'World {tag}']);
	});

	it('handles escaped quotes', () => {
		expect(
			extractTranslatableStrings(`
				This is a test {{t "He said, \\"Hello\\""}}
			`)
		).toEqual(['He said, "Hello"']);

		expect(
			extractTranslatableStrings(`
				This is a test {{t "He said, \\\"Hello\\\""}}
			`)
		).toEqual(['He said, "Hello"']);

		expect(
			extractTranslatableStrings(`
				This is a test {{t "He said, \\\\"Hello\\\\""}}
			`)
		).toEqual(['He said, \\"Hello\\"']);

		expect(
			extractTranslatableStrings(`This is a test {{t 'He said, \\'Hello\\''}}`)
		).toEqual(["He said, 'Hello'"]);

		expect(
			extractTranslatableStrings(`This is a test {{t 'He said, \\\'Hello\\\''}}`)
		).toEqual(["He said, 'Hello'"]);

		expect(
			extractTranslatableStrings(`This is a test {{t 'He said, \\\\'Hello\\\\''}}`)
		).toEqual(["He said, \\\'Hello\\\'"]);
	});

	it('handles nested strings', () => {
		expect(
			extractTranslatableStrings(`
				{{t "Hello {test}" test="<a href="https://ghost.org">Ghost</a>"}}
			`)
		).toEqual(['Hello {test}']);

		expect(
			extractTranslatableStrings(`
				{{{t "Hello {test}" test="<a href="https://ghost.org">Ghost</a>"}}}
			`)
		).toEqual(['Hello {test}']);

		expect(
			extractTranslatableStrings(`
				{{t 'Hello {test}' test='<a href="https://ghost.org">Ghost</a>'}}
			`)
		).toEqual(['Hello {test}']);

		expect(
			extractTranslatableStrings(`
				{{{t 'Hello {test}' test='<a href="https://ghost.org">Ghost</a>'}}}
			`)
		).toEqual(['Hello {test}']);
	});

	it('handles plurals', () => {
		expect(
			extractTranslatableStrings(`
				{{plural ../test.test empty=(t "Test") singular=(t "Hello") plural=(t "World")}}
			`)
		).toEqual(['Test', 'Hello', 'World']);

		expect(
			extractTranslatableStrings(`
				{{plural ../test.test empty=(t "Test") singular=(t "Hello {test}") plural=(t "World {test}")}}
			`)
		).toEqual(['Test', 'Hello {test}', 'World {test}']);

		expect(
			extractTranslatableStrings(`
				{{plural ../test.test empty=(t 'Test') singular=(t 'Hello') plural=(t 'World')}}
			`)
		).toEqual(['Test', 'Hello', 'World']);

		expect(
			extractTranslatableStrings(`
				{{plural ../test.test empty=(t 'Test') singular=(t 'Hello {test}') plural=(t 'World {test}')}}
			`)
		).toEqual(['Test', 'Hello {test}', 'World {test}']);
	});

	it('handles duplicate strings', () => {
		expect(
			extractTranslatableStrings(`
				This is a test {{t "Hello"}} and another {{t "World"}}
				This is a test {{t "Hello"}} and another {{t "World"}}
				This is a test {{t "Another"}} and another {{t "World"}}
			`)
		).toEqual(['Hello', 'World', 'Another']);
	});
});
