import path from 'path';
import { access, readdir } from 'fs/promises';
import { globby } from 'globby';
import meow from 'meow';
import inquirer from 'inquirer';
import chalk from 'chalk';
import makeDir from 'make-dir';
import { abort } from '../utils';

const {
    flags: {
        translations: translationPath,
        template: templatePath,
        languages: rawLanguages,
        output: outputDir,
    },
} = meow(`
    Usage
        $ node ./dist/index.js

    Options
        -t, --translations  Path to translations file
        -c, --template        Path to template JSON directory
        -l, --languages     Comma separated list of languages to translate. Must match columns in the translation file.
        -o, --output        Directory to save the translated templates to. Will be created if it doesn't exist.

    Example
        $ node ./dist/index.js --translations ~/i18n.xlsx --template ~/template/ --languages en,es,fr --output ~/output/
`, {
    importMeta: import.meta,
    flags: {
        translations: { type: 'string', alias: 't', isRequired: true },
        template: { type: 'string', alias: 'e', isRequired: true },
        languages: { type: 'string', alias: 'l', isRequired: false, default: 'en' },
        output: { type: 'string', alias: 'o', isRequired: true },
    },
});

const languages = rawLanguages.split(',').filter(lang => !lang.startsWith('!'));
const templatePaths = await globby(`${path.resolve(templatePath)}/**/*.json`);
if (templatePaths.length === 0) abort('Template directory contains no JSON files');

const outputDirExists = await access(outputDir).then(() => true).catch(() => false);
const outputDirEmpty = await readdir(outputDir).then(files => files.length === 0).catch(() => true);

const { createOutputDir, emptyOutputDir } = await inquirer.prompt([
    {
        type: 'confirm',
        name: 'createOutputDir',
        message: `${outputDir} doesn't exist. Do you want to create it?`,
        when: () => !outputDirExists,
        default: true,
    },
    {
        type: 'confirm',
        name: 'emptyOutputDir',
        message: chalk.red(`${outputDir} is not empty. Do you want to continue?`),
        when: () => !outputDirEmpty,
        default: false,
    },
]);

if (!outputDirExists && createOutputDir === false) {
    abort(`${outputDir} doesn't exist`);
}

if (!outputDirExists && createOutputDir === true) {
    console.log(`Creating ${outputDir}`);
    await makeDir(outputDir);
}

if (!outputDirEmpty && emptyOutputDir === false) {
    process.exit();
}

if (!outputDirEmpty && emptyOutputDir === true) {
    console.log(`Translated content will be added to ${outputDir} and overwrite in-case of conflict`);
}

export default {
    translationPath,
    templatePath,
    rawLanguages,
    outputDir,
    languages,
    templatePaths,
    createOutputDir,
    emptyOutputDir,
};
