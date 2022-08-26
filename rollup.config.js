import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import onWarn from './rollup/onWarn';

export default defineConfig({
    input: 'src/index.ts',
    output: {
        dir: 'dist',
        format: 'es',
        sourcemap: true,
    },
    plugins: [
        typescript(),
    ],
    onwarn: onWarn({
        skip: [
            { code: 'CIRCULAR_DEPENDENCY', path: 'src/utils' },
        ],
    }),
    external: [
        'fs/promises',
        'path',
        'globby',
        'meow',
        'fs',
        'xlsx',
        'markdown-it',
        'chalk',
    ],
});
