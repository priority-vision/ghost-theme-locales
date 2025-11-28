# Ghost Theme Locales (gtl) <!-- omit in toc -->

CLI tool to create locale json files in Ghost themes.

## Table of Contents <!-- omit in toc -->

- [Installation](#installation)
- [Preparation](#preparation)
- [Usage](#usage)
- [Commands](#commands)
	- [gtl](#gtl)
	- [gtl create](#gtl-create)
- [Developer Setup](#developer-setup)
- [Copyright \& License](#copyright--license)

## Installation

Ensure you have Node.js installed. Then, install GTL globally using npm:

```bash
npm install -g ghost-theme-locales
```

or install locally in your project:

```bash
npm install -D ghost-theme-locales
```

## Preparation

Before using this tool prepare your theme files. Use `{{t}}` in your `.hbs` files to make the hard coded strings translatable. Know more about `{{t}}` helper [here at Ghost official documentation](https://ghost.org/docs/api/v3/handlebars-themes/helpers/translate/).

After preparing your theme you can use this tool to generate your language file.

## Usage

```bash
gtl <command> [options]
```

## Commands

### gtl

```bash
gtl [option]
```

| Option            | Description                                                  |
| ----------------- | :----------------------------------------------------------- |
| `--version` | Output the version number |
| `--help`    | Output usage information  |

### gtl create

```bash
gtl c [options]
```

or

```bash
gtl create [options]
```

| Option            | Description                                                  | Default |
| ----------------- | :----------------------------------------------------------- | :------ |
| `-l ` , `--language`    | Language code | `en` |
| `-f` , `--forceRewrite`    | Force rewrite existing locales file even if it has no new strings | `false` |

## Developer Setup

1. Fork this repo
2. `git clone https://github.com/priority-vision/ghost-theme-locales.git path/to/your/workspace`
3. `cd path/to/your/workspace`
4. `npm install`

To run the CLI using your workspace files

1. `npm link`
2. `gtl <command> [options]` ( you can run anywhere on your system)

## Copyright & License

- MIT License
- Copyright (c) 2024 Priority Vision.
- Original idea from <https://github.com/biswajit-saha/ghost-theme-translator>
- Ghost is a trademark of Ghost Foundation Ltd.
