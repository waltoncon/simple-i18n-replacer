import type { Renderer } from '../types';
import markdown from './markdown';
import plain from './plain';
import html from './html';

const renderers: Record<string, Renderer> = {
    markdown,
    plain,
    html,
};

export const rendererKeys = Object.keys(renderers);

export default renderers;
