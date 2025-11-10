import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierPlugin from 'eslint-plugin-prettier';

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{js,jsx,cjs}'],
        extends: [
            js.configs.recommended,
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        plugins: {
            prettier: prettierPlugin
        },
        rules: {
            'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
            'indent': ['error', 4, { 'SwitchCase': 1 }],
            'semi': ['error', 'always'],
            'max-len': ['warn', { 'code': 80, 'ignoreComments': true }],
            'object-curly-spacing': ['error', 'always'],
            'quotes': ['error', 'single'],
            'prettier/prettier': 'error',
        },
    },
]);
