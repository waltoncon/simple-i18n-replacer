import { readFile, writeFile } from 'fs/promises';
import { dirname } from 'path';
import chalk from 'chalk';
import makeDir from 'make-dir';
import cli from './cli/parseArgs';
import { finderRegex } from './contants';
import getTranslation from './utils/getTranslation';
import { processFile } from './utils/processXlsx';

const {
    languages,
    templatePath,
    templatePaths,
    translationPath,
    outputDir,
} = cli;

const { data } = await processFile(translationPath);

for (const language of languages) {
    console.log(chalk.blue(`PROCESSING ${language}`));

    const languageOutputDir = `${outputDir}/output_${language}`;

    for (const templateFile of templatePaths) {
        const newFilePath = templateFile.replace(templatePath, languageOutputDir);
        const newFileDir = dirname(newFilePath);

        const fileContent = await readFile(templateFile, 'utf8');

        const newFileContent = fileContent.replace(finderRegex, (_, id, type) => {
            return getTranslation(data, id, type, language);
        });

        await makeDir(newFileDir);
        await writeFile(newFilePath, newFileContent, 'utf8');
    }
}
