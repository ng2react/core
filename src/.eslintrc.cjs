module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  root: true,
  ignorePatterns: ['node_modules', 'dist', 'coverage', '.eslintrc.cjs', 'templates'],
  rules: {
    quotes: ['error', 'single'],
    'semi': ['error', 'never'],
    "@typescript-eslint/semi": ['error', 'never'],
  }
};