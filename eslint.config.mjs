import eslint from '@eslint/js';
import tslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default tslint.config(
  eslint.configs.recommended,
  ...tslint.configs.recommended,
  ...svelte.configs['flat/recommended'],
  {
    ignores: ['dist/*'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
);
