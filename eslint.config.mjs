import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['node_modules/', 'playwright-report/', 'test-results/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'max-lines-per-function': ['warn', { max: 30, skipComments: true, skipBlankLines: true }],
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
  { files: ['tests/**/*.ts'], rules: { 'max-lines-per-function': 'off' } },
);
