import eslint from '@eslint/js';
import pretty from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import parser from 'svelte-eslint-parser';
import tslint from 'typescript-eslint';

export default tslint.config(
  eslint.configs.recommended,
  ...tslint.configs.recommended,
  ...svelte.configs['flat/recommended'],
  pretty,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser, chrome: 'readonly' },
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser,
      globals: { ...globals.browser, chrome: 'readonly' },
      parserOptions: {
        parser: tslint.parser,
        extraFileExtensions: ['.svelte'],
      },
    },
    rules: {
      'svelte/no-at-html-tags': 'off',
      'svelte/valid-compile': ['error', { ignoreWarnings: true }],
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
);
