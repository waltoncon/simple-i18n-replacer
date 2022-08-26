import { rendererKeys } from './renderers';

export const uuidRegex = '[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}';
export const finderRegex = new RegExp(`\\bi18n:(?<id>${uuidRegex})\\/(?<type>${rendererKeys.join('|')})\\b`, 'g');
