module.exports = (api) => {
    // Cache configuration is a required option
    api.cache(false);

    const sharedPresets = ['@babel/typescript'];
    const shared = {
        ignore: ['src/test'],
        presets: sharedPresets
    }

    return {
        env: {
            esm: {
                ...shared,
                presets: [['@babel/env', {
                    modules: false
                }], ...sharedPresets],
                plugins: [
                    ["replace-import-extension", {
                        "extMapping": {
                            ".ts": ""
                        }
                    }]
                ]
            },
            cjs: {
                ...shared,
                presets: [['@babel/env', {
                    modules: 'commonjs',

                }], ...sharedPresets],
                plugins: [
                    ["replace-import-extension", {
                        "extMapping": {
                            ".ts": ".cjs"
                        }
                    }],
                    ["@babel/transform-modules-commonjs"]
                ]
            },
            test:
                {
                    test: ['./src/**/*.ts'],
                    presets: [
                        "@babel/preset-env",
                        "@babel/preset-typescript",
                    ],
                },
        }
    }
};

