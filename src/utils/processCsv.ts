import fs from 'node:fs';
import { finished } from 'stream/promises';
import { parse } from 'csv';
import type { Translation } from '../types';

export const processFile = async (filepath: string) => {
    const records: Translation[] = [];

    const parser = fs
        .createReadStream(filepath)
        .pipe(parse({
            columns: true,
        }));

    parser.on('readable', () => {
        let record;
        do {
            record = parser.read();

            if (record) {
                records.push(record);
            }
        } while (record !== null);
    });

    await finished(parser);

    return records;
};
