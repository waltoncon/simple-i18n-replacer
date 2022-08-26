import { readFile } from 'fs/promises';
import chalk from 'chalk';
import { processFile } from './utils/processXlsx';
import getTranslation from './utils/getTranslation';
import cli from './cli/parseArgs';
import { finderRegex } from './contants';
const {
    languages,
    templatePaths,
    translationPath,
} = cli;

console.log('from index', cli.translationPath);
const { data } = await processFile(translationPath);

for (const language of languages) {
    console.log(chalk.blue(`PROCESSING ${language}`));

    for (const templateFile of templatePaths) {
        if (!templateFile.includes('unit_000/000_020_textcolumn.json')) {
            continue;
        }
        console.log(templateFile);

        const fileContent = await readFile(templateFile, 'utf8');

        const newFileContent = fileContent.replace(finderRegex, (substring, id, type) => {
            console.log({ substring, id, type });
            return getTranslation(data, id, type, language);
        });

        console.log(newFileContent);

        process.exit();
    }
}
