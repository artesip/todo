import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

import jsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from "eslint-plugin-react";
import tsParser from '@typescript-eslint/parser';
import reactCompiler from 'eslint-plugin-react-compiler'
import eslintPluginImportX from 'eslint-plugin-import-x';
import {createTypeScriptImportResolver} from 'eslint-import-resolver-typescript';
import { defineConfig } from 'eslint/config';

export default defineConfig({
  ignores: ['dist', '.next/**'],
  extends: [
    js.configs.recommended,
      ...tseslint.configs.recommended,
      pluginReact.configs.flat.recommended,
      
      eslintPluginImportX.flatConfigs.recommended,
      eslintPluginImportX.flatConfigs.typescript,
  ],
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    parser: tsParser,
    sourceType: 'module',
    ecmaVersion: 'latest',
    globals: globals.browser,
  },
  plugins: {
    'jsx-a11y': jsxA11y,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    'react-compiler': reactCompiler,
  },
  settings: {
    'import-x/resolver-next': [
      createTypeScriptImportResolver({
        alwaysTryTypes: true,
        project: './tsconfig.app.json'
      })
    ],
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    
    'react-compiler/react-compiler': 'error',

    'no-unused-vars': 'off',

    'import-x/no-dynamic-require': 'warn',
    'import-x/no-nodejs-modules': 'warn',
    "import-x/consistent-type-specifier-style": ["error", "prefer-top-level"],
    "import-x/order": ["error", {
      "newlines-between": "always",
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"]
    }],
    "@typescript-eslint/consistent-type-imports": ["error",{"prefer": "type-imports"}],

    "key-spacing": ["error", { "align": "colon" }],
    "jsx-quotes": ["error", "prefer-single"],
    "keyword-spacing": ["error", { "before": true, "after": true }],
    "react/jsx-indent": ["error", 2],
    "react/jsx-indent-props": ["error", 2],
    'object-curly-spacing': ['error', 'always'],
    "semi": ["error", "always", { "omitLastInOneLineBlock": true }],

    "react/destructuring-assignment": "off",
    "@typescript-eslint/no-empty-function": "off",
    "react/no-unstable-nested-components": ["error", {
      "allowAsProps": true
    }],

    "linebreak-style": ["error", "unix"],
    "prefer-arrow-callback": "off",

    "react/react-in-jsx-scope": "off",

    "react/jsx-props-no-spreading": "off",
    "no-return-assign": "off",
    "max-depth": ["error", {"max": 6}],
    "max-params": "off",
    "@next/next/no-sync-scripts": "off",
    "react/jsx-curly-spacing": [2, "always"],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".tsx"] }],
    "indent": ["error", 2, {
      "ignoredNodes": ["JSXAttribute"]
    }],
    "max-len": "off",
    "no-multi-spaces": "off",
    "no-unused-expressions": "off",
    "react/jsx-equals-spacing": "off",

    "no-bitwise": "off",
    "no-underscore-dangle": "off",
    "react/require-default-props": [0],
    "jsx-a11y/anchor-is-valid": 1,
    "jsx-a11y/label-has-associated-control": 1,
    "jsx-a11y/no-static-element-interactions": 1,
    "react/jsx-one-expression-per-line": "off",
    "prefer-destructuring": "off",

    "array-bracket-newline": ["error", "consistent"],
    "array-bracket-spacing": ["error", "never"],
    "block-spacing": ["error", "always"],
    "brace-style": ["error", "1tbs"],
    "comma-dangle": ["error", "only-multiline"],
    "comma-spacing": ["error", { "before": false, "after": true }],
    "comma-style": ["error", "last"],
    "computed-property-spacing": ["error", "never", { "enforceForClassMembers": true }],
    "func-call-spacing": ["error", "never"],
    "function-call-argument-newline": ["error", "consistent"],
    "function-paren-newline": ["error", "consistent"],
    "lines-between-class-members": ["error", "always", { "exceptAfterSingleLine": true }],
    "multiline-ternary": ["error", "always-multiline"],
    "new-cap": ["error", { "newIsCap": true, "capIsNew": false }],
    "new-parens": "error",
    "no-lonely-if": "error",
    "no-new-object": "error",
    "no-whitespace-before-property": "error",
    "nonblock-statement-body-position": ["error", "beside"],
    "object-curly-newline": ["error", { "consistent": true }],
    "operator-assignment": ["error", "always"],
    "operator-linebreak": ["error", "after", { "overrides": { "?": "before", ":": "before" } }],
    "prefer-exponentiation-operator": "error",
    "quotes": ["error", "single"],
    "semi-spacing": ["error", { "before": false, "after": true }],
    "semi-style": ["error", "last"],
    "space-before-blocks": "error",
    "space-before-function-paren": ["error", { "anonymous": "always", "named": "never", "asyncArrow": "always" }],
    "space-in-parens": ["error", "never"],
    "space-infix-ops": "error",
    "space-unary-ops": "error",
    "switch-colon-spacing": "error",
    "template-tag-spacing": "error",
    "wrap-regex": "error"
  },
})
