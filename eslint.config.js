/**
 * Flat config (ESLint 9). Ported from .eslintrc.cjs.
 * Not ported (need extra packages): plugin:@wordpress/eslint-plugin,
 * prettier/prettier, import/no-extraneous-dependencies, import/no-unresolved,
 * react/prop-types. Add those plugins and rules here if needed.
 */

import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
	{ ignores: ['dist'] },
	js.configs.recommended,
	{
		files: ['scripts/**/*.mjs'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: globals.node,
		},
	},
	{
		files: ['**/*.{js,jsx}'],
		languageOptions: {
			ecmaVersion: 'latest',
			globals: globals.browser,
			parserOptions: {
				ecmaVersion: 'latest',
				ecmaFeatures: { jsx: true },
				sourceType: 'module',
			},
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
			// From .eslintrc.cjs
			'no-console': ['warn', { allow: ['error'] }],
			'no-alert': 'off',
			'arrow-body-style': 'off',
			'no-undef': 'off',
			semi: ['error', 'always'],
		},
	},
];
