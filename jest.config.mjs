/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    preset: 'ts-jest',

    // Automatically clear mock calls, instances, contexts and results before every test
    clearMocks: true,

    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,

    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',

    coverageProvider: 'v8',
    transform: {
        '^.+\\.ts?$': ['ts-jest', { tsconfig: 'src/test/tsconfig.json' }],
    },
    roots: ['<rootDir>/src/test'],
}
