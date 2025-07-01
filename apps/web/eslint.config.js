// apps/web/eslint.config.js
import { FlatCompat } from '@eslint/eslintrc'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {
    extends: ['eslint:recommended'],
  },
})

export default [
  ...compat.config({
    extends: ['next', 'next/core-web-vitals'],
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
    },
  }),
]
