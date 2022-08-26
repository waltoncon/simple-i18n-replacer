import path from 'path';
import { access, readdir } from 'fs/promises';
import { globby } from 'globby';
import meow from 'meow';
import inquirer from 'inquirer';
import chalk from 'chalk';
import makeDir from 'make-dir';
import { abort } from '../utils';

const {
    flags: { translations: translationPath, course: templatePath, languages: rawLanguages, output },
} = meow(`
    Usage
        $ foo

    Options
        --translations, -t  Path to translations file
        --course, -c        Path to template course JSON directory
`, {
    importMeta: import.meta,
    flags: {
        translations: { type: 'string', alias: 't', isRequired: true },
        course: { type: 'string', alias: 'c', isRequired: true },
        languages: { type: 'string', alias: 'l', isRequired: false, default: 'en' },
        output: { type: 'string', alias: 'o', isRequired: true },
    },
});

const languages = rawLanguages.split(',');
const templatePaths = await globby(`${path.resolve(templatePath)}/**/*.json`);
if (templatePaths.length === 0) abort('Path to template course contains no JSON files');

const outputDirExists = await access(output).then(() => true).catch(() => false);
const outputDirEmpty = await readdir(output).then(files => files.length === 0).catch(() => true);

console.log({ outputDirExists, outputDirEmpty });

const { createOutputDir, emptyOutputDir } = await inquirer.prompt([
    {
        type: 'confirm',
        name: 'createOutputDir',
        message: `${output} doesn't exist. Do you want to create it?`,
        when: () => !outputDirExists,
        default: true,
    },
    {
        type: 'confirm',
        name: 'emptyOutputDir',
        message: chalk.red(`${output} is not empty. Do you want to continue? (The folder will be emptied)`),
        when: () => !outputDirEmpty,
        default: false,
    },
]);

if (!outputDirExists && createOutputDir === false) {
    abort(`${output} doesn't exist`);
}

if (!outputDirExists && createOutputDir === true) {
    console.log(`Creating ${output}`);
    await makeDir(output);
}

if (!outputDirEmpty && emptyOutputDir === false) {
    process.exit();
}
if (!outputDirEmpty && emptyOutputDir === true) {
    console.log('EMPTYING OUTPUT DIR');
}

console.log({ createOutputDir, emptyOutputDir });

export default {
    translationPath,
    templatePath,
    rawLanguages,
    languages,
    templatePaths,
    createOutputDir,
    emptyOutputDir,
};
