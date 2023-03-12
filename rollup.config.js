import typescript from '@rollup/plugin-typescript';

// export default {
//     input: 'src/bin/cli.mts',
//     output: {
//         dir: 'dist',
//         format: 'es'
//     },
//     plugins: [typescript()]
// };

// import resolve from '@rollup/plugin-node-resolve';
// import ts from '@wessberg/rollup-plugin-ts';
// import { terser } from 'rollup-plugin-terser';

import pkg from './package.json' assert {type: 'json'}

// const minifiedOutputs = [
//     {
//         file: pkg.exports['.'].import,
//         format: 'esm',
//     },
//     {
//         file: pkg.exports['.'].require,
//         format: 'cjs',
//     },
// ];

// const unminifiedOutputs = minifiedOutputs.map(({ file, ...rest }) => ({
//     ...rest,
//     file: file.replace('.min.', '.'),
// }));

export default [
    {
        input: './src/bin/cli.mts',
        output: [
            {
                file: pkg.bin,
                format: 'esm',
            },
    
        ],
        plugins: [
            typescript()
            // resolve(),
            // terser({ include: /\.min\.[^.]+$/ }),
        ],
        // external: [/^@babel\/runtime\//],
    },
    {
        input: './src/index.mts',
        output: [
            {
                file: pkg.exports['.'].import,
                format: 'es',
            },
            {
                file: pkg.exports['.'].require,
                format: 'cjs',
            },
        ],
        plugins: [
            typescript()
            // resolve(),
            // terser({ include: /\.min\.[^.]+$/ }),
        ],
        // external: [/^@babel\/runtime\//],
    },
];