import markdownIt from 'markdown-it';
import type { Renderer } from '../types';
import { quotelessStringify } from '../utils';

const md = markdownIt();

const renderer: Renderer = (value: string) => {
    return quotelessStringify(md.render(value));
};

export default renderer;

