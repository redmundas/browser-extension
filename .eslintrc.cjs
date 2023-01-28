module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],

  plugins: ['prettier', 'promise', '@typescript-eslint', 'simple-import-sort', 'svelte3'],

  rules: {
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    'class-methods-use-this': 'off',
    'default-case': 'off',
    'import/default': 'off',
    'import/named': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'no-case-declarations': 'off',
    'no-console': 'off',
    'no-continue': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-undef': 'off',
    'no-useless-escape': 'off',
    'object-curly-newline': 'off',

    'prettier/prettier': 'error',
    'promise/always-return': 'error',
    'promise/avoid-new': 'off',
    'promise/catch-or-return': 'error',
    'promise/no-callback-in-promise': 'error',
    'promise/no-native': 'off',
    'promise/no-nesting': 'error',
    'promise/no-new-statics': 'error',
    'promise/no-promise-in-callback': 'error',
    'promise/no-return-in-finally': 'error',
    'promise/no-return-wrap': 'error',
    'promise/param-names': 'error',
    'promise/valid-params': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message: 'for..in loops are error prone.',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; dont use them.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed.',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
  },

  overrides: [
    { files: ['*.svelte'], processor: 'svelte3/svelte3' },
    {
      files: ['*/__tests__/*'],
      rules: {
        '@typescript-eslint/no-object-literal-type-assertion': 0,
        '@typescript-eslint/no-explicit-any': 0,
      },
      env: {
        jest: true,
      },
    },
  ],

  settings: {
    'svelte3/typescript': () => require('typescript'),
  },

  ignorePatterns: ['dist/**'],
};
