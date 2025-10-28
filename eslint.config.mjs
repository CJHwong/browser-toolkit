import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,

  // ES Module files first (most specific)
  {
    files: [
      'eslint.config.mjs',
      'tools/markslide-studio/src/theme/*.js',
      'tools/markslide-studio/src/utils/*.js',
    ],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        Event: 'readonly',
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

  // React/JSX files
  {
    files: [
      'tools/markslide-studio/src/**/*.js',
      'tools/markslide-studio/src/**/*.jsx',
    ],
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
        Event: 'readonly',
        Array: 'readonly',
        process: 'readonly',
        fetch: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
        alert: 'readonly',
        navigator: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        localStorage: 'readonly',
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
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-useless-escape': 'off', // Allow regex escapes
    },
  },

  // Node.js config files
  {
    files: [
      'tools/markslide-studio/**/*.config.js',
      'tools/markslide-studio/tailwind.config.js',
      'tools/markslide-studio/postcss.config.js',
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

  // General browser JavaScript files (but exclude ES modules)
  {
    files: ['**/*.js'],
    ignores: [
      'tools/markslide-studio/src/theme/*.js',
      'tools/markslide-studio/src/utils/*.js',
    ],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'script',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setImmediate: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',
        performance: 'readonly',
        MessageChannel: 'readonly',
        fetch: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        FormData: 'readonly',
        Headers: 'readonly',
        XMLHttpRequest: 'readonly',
        Worker: 'readonly',
        WebSocket: 'readonly',
        // Node.js globals
        global: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        // Firebase (for scrum-poker)
        firebase: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prefer-const': 'warn',
      'no-var': 'error',
      // Be less strict about built/minified files
      'no-undef': 'warn',
      'no-unreachable': 'warn',
      'no-empty': 'warn',
      'no-cond-assign': 'warn',
      'no-prototype-builtins': 'warn',
      'no-misleading-character-class': 'warn',
      'no-control-regex': 'warn',
    },
  },

  // Global ignores
  {
    ignores: [
      'node_modules/**',
      '**/node_modules/**',
      'tools/markslide-studio/build/**',
      'tools/markslide-studio/coverage/**',
      'docs/**', // Ignore built docs folder completely
      'dist/**', // Ignore built dist folder
      '**/*.min.js',
      '**/*.html',
      'remove-secrets-from-history.sh',
      'eslint.config.mjs',
    ],
  },
];
