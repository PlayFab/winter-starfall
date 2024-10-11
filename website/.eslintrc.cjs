const configFiles = [".eslintrc.cjs", "gruntfile.cjs"];

module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		useJSXTextNode: true,
		ecmaVersion: 6,
		sourceType: "module",
		ecmaFeatures: {
			modules: true,
			jsx: true,
		},
	},
	extends: ["eslint:recommended"],
	settings: {
		react: {
			version: "detect",
		},
	},
	overrides: [
		// typescript
		{
			files: ["*.ts", "*.tsx"],
			plugins: ["@typescript-eslint", "react", "react-hooks"],
			rules: {
				"@typescript-eslint/no-explicit-any": "off",
				"@typescript-eslint/no-inferrable-types": "off",
				"@typescript-eslint/triple-slash-reference": "off",
				"react-hooks/rules-of-hooks": "error",
				"react-hooks/exhaustive-deps": "warn",
				"react/jsx-uses-react": "error",
				"react/jsx-uses-vars": "error",
				"react/display-name": "off",
				"no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
			},
			extends: ["plugin:@typescript-eslint/recommended", "plugin:react/recommended"],
		},
		// config files
		{
			files: configFiles,
			env: { node: true },
		},
	],
};
