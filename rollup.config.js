import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/bin/cli.mts',
    output: {
        dir: 'dist',
        format: 'es'
    },
    plugins: [typescript()]
};