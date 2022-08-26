import * as fs from 'fs';
import { readFile, set_fs, utils } from 'xlsx';
import type { Translation } from '../types';
import { abort } from '../utils';
set_fs(fs);

export const processFile = (filepath: string) => {
    const workbook = readFile(filepath);
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) abort('Cannot find any sheets');

    const sheet = workbook.Sheets[sheetName];

    if (!sheet) abort('Cannot load sheet');

    const ref = sheet['!ref'];

    if (!ref) abort('Sheet is empty');

    const [startRef, endRef] = ref.split(':');

    if (!startRef || !endRef) abort('Sheet is empty');

    const startRefDecoded = utils.decode_cell(startRef);
    const { c: startRefDecodedCol, r: startRefDecodedRow } = startRefDecoded;
    const endRefDecoded = utils.decode_cell(endRef);
    const { c: endRefDecodedCol, r: endRefDecodedRow } = endRefDecoded;

    const data = utils.sheet_to_json<Translation>(sheet);

    return {
        sheet,
        data,
        endRef,
        endRefDecoded,
        endRefDecodedCol,
        endRefDecodedRow,
        startRef,
        startRefDecoded,
        startRefDecodedCol,
        startRefDecodedRow,
    };
};
