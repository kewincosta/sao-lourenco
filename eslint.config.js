const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');
const reactHooks = require('eslint-plugin-react-hooks');
const reactRefresh = require('eslint-plugin-react-refresh');
const globals = require('globals');

module.exports = tseslint.config(
  {
    ignores: [
      '**/dist',
      '**/node_modules',
      '**/migrations/**',
      '**/*.tsbuildinfo',
      'eslint.config.js',
      // SPEC_DEVIATION: portal-turstico-so-l is the original Spark clone,
      // already superseded by apps/web (T1-T6) and scheduled for removal in
      // T9. It is not a workspace member and was never meant to be linted;
      // excluding it here unblocks the root `eslint .` gate for T7 without
      // touching its (soon to be deleted) content.
      'portal-turstico-so-l/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    // Build-time config files under apps/web (e.g. tailwind.config.js) run in
    // Node, not the browser, and are plain .js (no react-hooks/react-refresh
    // relevance) — give them Node globals so `console`/`fs` etc. aren't
    // flagged by no-undef.
    files: ['apps/web/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // SPEC_DEVIATION: shadcn-generated UI components re-export non-component
    // values (e.g. `buttonVariants`) alongside the component itself, which
    // trips react-refresh/only-export-components, and some re-export-only
    // files trip no-unused-vars false positives. Reason: this directory is
    // vendor/generated UI code (not hand-authored app logic); relaxing here
    // avoids blocking the migration without weakening lint for the rest of
    // the app.
    files: ['apps/web/src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
);
