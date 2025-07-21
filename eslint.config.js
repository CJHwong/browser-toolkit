import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  {
    files: ['eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {},
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },
  {
    files: ['markslide-studio/src/**/*.js', 'markslide-studio/src/**/*.jsx'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        Array: 'readonly',
        process: 'readonly',
        fetch: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
        alert: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        describe: 'readonly',
        it: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prefer-const': 'warn',
      'no-var': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    files: [
      'markslide-studio/**/*.config.js',
      'markslide-studio/tailwind.config.js',
      'markslide-studio/postcss.config.js',
    ],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'script',
      globals: {
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },
  {
    ignores: [
      'node_modules/**',
      '**/node_modules/**',
      'markslide-studio/build/**',
      'markslide-studio/coverage/**',
      '**/*.min.js',
      '**/*.html',
    ],
  },
];
