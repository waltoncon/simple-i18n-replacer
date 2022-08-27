# Simple i18n replacer

Create JSON directories based on a template directory and populate with translated content from a translations spreadsheet.

- [Simple i18n replacer](#simple-i18n-replacer)
  - [Usage](#usage)
  - [How does it work](#how-does-it-work)
  - [Structuring the `--translations` file](#structuring-the---translations-file)
  - [Structuring the JSON files in the `--template` directory](#structuring-the-json-files-in-the---template-directory)
  - [Renderers](#renderers)
    - [Plain renderer (`plain`)](#plain-renderer-plain)
    - [Markdown renderer (`markdown`, `md`)](#markdown-renderer-markdown-md)
  - [Notes](#notes)
    - [JSON stringify](#json-stringify)
    - [Excel formatting](#excel-formatting)

## Usage

**Install dependencies and build first**

```shell
npm i
npm run build
```

```plain
Usage
    $ node ./dist/index.js

Options
    -t, --translations  Path to translations file
    -c, --template        Path to template JSON directory
    -l, --languages     Comma separated list of languages to translate. Must match columns in the translation file.
    -o, --output        Directory to save the translated templates to. Will be created if it doesn't exist.

Example
    $ node ./dist/index.js --translations ~/i18n.xlsx --template ~/template/ --languages en,es,fr --output ~/output/
```

## How does it work

This command will search through every `.json` file in the `--template` directory for matching translation keys and replace the translation key with the correct content from the `--translations` Excel file.

## Structuring the `--translations` file

- There must be a `!id` column
- IDs must be a UUID string that matches `[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}`
- Any other columns with `!` prefixes will be ignored
- Every other column will count as a language and can be enabled by adding to `--languages`
- The language codes must match the values used with `--languages`

**Example:**

| !id                                  | !notes   | en       | es       | fr         |
| ------------------------------------ | -------- | -------- | -------- | ---------- |
| e8040077-d2e2-4e71-a7c1-376a2764cb35 | Greeting | Hello    | Hola     | Bonjour    |
| 8a122b8d-d11a-4e2f-85f8-611cb1bc6ee0 | Auth     | Login    | Acceso   | Connexion  |
| 7c091145-5515-464b-8ec5-e54d0fdc6da5 | Auth     | Register | Registro | S'inscrire |

The language columns can be called anything as long as it's valid for file paths.

Adding `en_US` to the above example would require adding `en_US` to the `--languages` flag:

```shell
node ./dist/index.js ---languages en,es,fr,en_US
```

## Structuring the JSON files in the `--template` directory

- Only files ending with `.json` will be copied to `--output`
- Translation keys will be replaced with content from the `--translations` file
- Translation keys must follow the format `i18n:<id>/<renderer>`
  - `i18n` is a required static string
  - `<id>` is the ID as written in the `--translations` file
  - `<renderer>` is the chosen renderer for this value. One of `plain`, `html`, or `markdown`. This is explained later.

**Example:**

```jsonc
// [--template]/welcome.json
{
    "url": "https://example.com/page"
    "title": "i18n:e8040077-d2e2-4e71-a7c1-376a2764cb35/plain"
}
```

**Running:**

```shell
node ./dist/index.js --languages en,es,fr <other-flags>
```

**Will become:**

```jsonc
// [--output]/output_en/welcome.json
{
    "url": "https://example.com/page"
    "title": "Hello"
}
```

```jsonc
// [--output]/output_es/welcome.json
{
    "url": "https://example.com/page"
    "title": "Hola"
}
```

```jsonc
// [--output]/output_fr/welcome.json
{
    "url": "https://example.com/page"
    "title": "Bonjour"
}
```

## Renderers

### Plain renderer (`plain`)

The content will be taken directly as written in the `--translations` file, JSON stringified, and added in place of the translation key.

### Markdown renderer (`markdown`, `md`)

The content is parsed using [markdown-it](https://github.com/markdown-it/markdown-it) and the output is JSON stringified the added in place of the translation key.

## Notes

### JSON stringify

The quotes are removed from JSON stringified values so that multiple translation keys can be used in the same JSON value

```json
{
    "url": "https://example.com/page"
    "title": "i18n:e8040077-d2e2-4e71-a7c1-376a2764cb35/plain i18n:8a122b8d-d11a-4e2f-85f8-611cb1bc6ee0/plain"
}
```

```json
{
    "url": "https://example.com/page"
    "title": "Hello Login"
}
```

Without removing the quotes, the output would be the following (invalid) JSON.

```json
{
    "url": "https://example.com/page"
    "title": ""Hello" "Login""
}
```

### Excel formatting

Formatting applied through Excel is lost with this command. If you want to add formatting to content in the `--translations` file you will need to write it with Markdown.