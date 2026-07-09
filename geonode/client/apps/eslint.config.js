import js from '@eslint/js'
import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

// Shared flat config for every app and package in the workspace.
export default defineConfig([
  globalIgnores(['**/dist', '**/node_modules']),
  {
    files: ['**/*.{js,jsx}'],
    plugins: { '@stylistic': stylistic },
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
    },
  },
  {
    // Build/config scripts run in Node (process, import.meta, fs, ...).
    files: ['**/vite.config.js', '**/*.mjs', 'eslint.config.js'],
    languageOptions: { globals: globals.node },
  },
  {
    // react-refresh is a Vite app-HMR concern; the shared library packages are
    // consumed as libraries, so mixing component + hook exports there is fine.
    files: ['packages/**'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
