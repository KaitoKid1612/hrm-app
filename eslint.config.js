// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.vscode/**',
      '**/out/**',
    ],
  },
  {
    files: [
      'backend/**/*.{ts,tsx,js,jsx}',
      'frontend-client/**/*.{ts,tsx,js,jsx}',
      'frontend-admin/**/*.{ts,tsx,js,jsx}',
      'shared/**/*.{ts,tsx,js,jsx}',
    ],
    ...js.configs.recommended,
    ...tseslint.configs.recommended,
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        project: null,
        tsconfigRootDir: undefined,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      prettier,
      'unused-imports': unusedImports,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    files: ['backend/**/*'],
    languageOptions: {
      globals: globals.node,
    },
    rules: { 'no-console': 'off' },
  },
  {
    files: ['frontend-client/src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: null,
        tsconfigRootDir: undefined,
      },
    },
  },
  {
    files: ['frontend-admin/src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: null,
        tsconfigRootDir: undefined,
      },
    },
    rules: {
      '@next/next/no-img-element': 'off',
      'react/no-unescaped-entities': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
  },
];
