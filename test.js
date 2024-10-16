import test from 'ava';
import extractTranslatableStrings from './lib/extract-translatable-strings.js';

/**
 * extractTranslatableStrings.
 */
test('extractTranslatableStrings: should handle brackets', t => {
	t.deepEqual(
		extractTranslatableStrings(`
			This is a test {{t "Hello"}} and another {{t "World"}}
		`),
		['Hello', 'World']
	);
	t.deepEqual(
		extractTranslatableStrings(`
			This is a test {{{t "Hello"}}} and another {{{t "World"}}}
		`),
		['Hello', 'World']
	);

	// Single quotes.
	t.deepEqual(
		extractTranslatableStrings(`
			This is a test {{t 'Hello'}} and another {{t 'World'}}
		`),
		['Hello', 'World']
	);
	t.deepEqual(
		extractTranslatableStrings(`
			This is a test {{{t 'Hello'}}} and another {{{t 'World'}}}
		`),
		['Hello', 'World']
	);
});

test('extractTranslatableStrings: should handle parentheses', t => {
	t.deepEqual(
		extractTranslatableStrings(`
			This is a test (t "Hello") and another (t "World")
		`),
		['Hello', 'World']
	);

	// Single quotes.
	t.deepEqual(
		extractTranslatableStrings(`
			This is a test (t 'Hello') and another (t 'World')
		`),
		['Hello', 'World']
	);
});

test('extractTranslatableStrings: should handle escaped quotes', t => {
	t.deepEqual(
		extractTranslatableStrings(`
			This is a test {{t "He said, \\"Hello\\""}}
		`),
		['He said, "Hello"']
	);
	t.deepEqual(
		extractTranslatableStrings(`
			This is a test {{t "He said, \\\"Hello\\\""}}
		`),
		['He said, "Hello"']
	);
	t.deepEqual(
		extractTranslatableStrings(`
			This is a test {{t "He said, \\\\"Hello\\\\""}}
		`),
		['He said, \\"Hello\\"']
	);

	// Single quotes.
	t.deepEqual(extractTranslatableStrings(
			`This is a test {{t 'He said, \\'Hello\\''}}`
		),
		["He said, 'Hello'"]
	);
	t.deepEqual(extractTranslatableStrings(
			`This is a test {{t 'He said, \\\'Hello\\\''}}`
		),
		["He said, 'Hello'"]
	);
	t.deepEqual(extractTranslatableStrings(
			`This is a test {{t 'He said, \\\\'Hello\\\\''}}`
		),
		["He said, \\'Hello\\'"]
	);
});

test('extractTranslatableStrings: should handle nested strings', t => {
	t.deepEqual(
		extractTranslatableStrings(`
			{{t "Hello {test}" test="<a href="https://ghost.org">Ghost</a>"}}
		`),
		['Hello {test}']
	);
	t.deepEqual(
		extractTranslatableStrings(`
			{{{t "Hello {test}" test="<a href="https://ghost.org">Ghost</a>"}}}
		`),
		['Hello {test}']
	);

	// Single quotes.
	t.deepEqual(
		extractTranslatableStrings(`
			{{t 'Hello {test}' test='<a href="https://ghost.org">Ghost</a>'}}
		`),
		['Hello {test}']
	);
	t.deepEqual(
		extractTranslatableStrings(`
			{{{t 'Hello {test}' test='<a href="https://ghost.org">Ghost</a>'}}}
		`),
		['Hello {test}']
	);
});

test('extractTranslatableStrings: should handle plurals', t => {
	t.deepEqual(
		extractTranslatableStrings(`
			{{plural ../test.test empty=(t "Test") singular=(t "Hello") plural=(t "World")}}
		`),
		['Test', 'Hello', 'World']
	);
	t.deepEqual(
		extractTranslatableStrings(`
			{{plural ../test.test empty=(t "Test") singular=(t "Hello {test}") plural=(t "World {test}")}}
		`),
		['Test', 'Hello {test}', 'World {test}']
	);

	// Single quotes.
	t.deepEqual(
		extractTranslatableStrings(`
			{{plural ../test.test empty=(t 'Test') singular=(t 'Hello') plural=(t 'World')}}
		`),
		['Test', 'Hello', 'World']
	);
	t.deepEqual(
		extractTranslatableStrings(`
			{{plural ../test.test empty=(t 'Test') singular=(t 'Hello {test}') plural=(t 'World {test}')}}
		`),
		['Test', 'Hello {test}', 'World {test}']
	);
});

test('extractTranslatableStrings: should handle duplicate strings', t => {
	t.deepEqual(
		extractTranslatableStrings(`
			This is a test {{t "Hello"}} and another {{t "World"}}
			This is a test {{t "Hello"}} and another {{t "World"}}
			This is a test {{t "Another"}} and another {{t "World"}}
		`),
		['Hello', 'World', 'Another']
	);
});
