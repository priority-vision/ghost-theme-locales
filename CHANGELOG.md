# Changelog

## [0.1.0] - Mar 18, 2026

- migrated tests from AVA to Vitest
- added TypeScript-based type checking for JavaScript sources with `tsc --noEmit`
- updated runtime and development dependencies
- fixed locale generation to preserve existing translated values instead of overwriting them
- extracted locale merge logic into a reusable helper
- expanded test coverage for CLI behavior, `forceRewrite`, invalid locale JSON, and themes without translatable strings
- reorganized tests into the `tests/` directory
- updated GitHub Actions workflows to run verification before publish

## [0.0.6] - Nov 28, 2025

- added types
- export main function `extractTranslatableStrings` to use in 3rd-party libs

## [0.0.4] - Dec 6, 2024

- added support for tilde symbol in brackets like `{{t "Hello"~}}` or `{{~t "World"~}}`

## [0.0.3] - Oct 25, 2024

- added support for nested strings like `(t "Hello {tag}" tag="World")`

## [0.0.2] - Oct 16, 2024

- initial release
