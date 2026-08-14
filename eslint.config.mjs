import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import jest from 'eslint-plugin-jest'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier/flat'
import globals from 'globals'

export default defineConfig([
  js.configs.recommended,

  ...nextVitals,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      '@typescript-eslint': tseslint,
    },

    rules: {
      ...tseslint.configs.recommended.rules,

      'no-unused-vars': 'warn',

      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
    },
  },

  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],

    ...jest.configs['flat/recommended'],

    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },

  {
    files: ['infra/**/*.js', 'test/**/*.js'],

    rules: {
      'no-console': 'off',
    },
  },

  prettier,

  globalIgnores([
    'node_modules/**',
    '.next/**',
    'coverage/**',
    'package*.json',
    'migrations/**',
    'infra/**',
  ]),
])
