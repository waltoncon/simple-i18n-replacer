import renderers from '../renderers';
import type { Translation } from '../types';

function getTranslation(data: Translation[], id: string, type: string, language: string) {
    const row = data.find(row => row.id === id);

    if (!row) {
        console.warn(`Cannot find translation: ${id}`);
        return `Missing translation: "${id}"`;
    }

    const value = row[language];

    if (value === undefined) {
        console.warn(`Cannot find translation: ${id} / ${language}`);
        return `Missing translation: "${id}" for "${language}"`;
    }

    const renderer = renderers[type];

    if (!renderer) {
        console.log(`Renderer "${type}" was requested but it not supported.`);
        return `Unsupported renderer "${type}"`;
    }

    return renderer(value);
}

export default getTranslation;
