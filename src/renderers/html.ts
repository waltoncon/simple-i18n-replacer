import type { Renderer } from '../types';
import { quotelessStringify } from '../utils';

const renderer: Renderer = (value: string) => {
    return quotelessStringify(value);
};

export default renderer;
