export default {
    paths: [
        './src/test/features/**/*.feature'
    ],
    require: [
        './src/test/stepDefinitions/**/*.ts'
    ],
    requireModule: [
        'ts-node/register'
    ]
    // default: [
    //     '--require-module ts-node/register',
    //     '--require ./src/test/stepDefinitions/**/*.ts'
    // ].join(' '),
}