const globals = require("globals");
const pluginJs = require("@eslint/js");
const tseslint = require("typescript-eslint");
const pluginReact = require("eslint-plugin-react");


/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]
  },
  {
    languageOptions: { globals: globals.browser }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    }
  }
];
