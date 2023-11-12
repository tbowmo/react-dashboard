module.exports = {
    root: true, // For configuration cascading.
    env: {
        commonjs: true, // CommonJS global variables and CommonJS scoping.Allows require, exports and module.
        es6: true, // Enable all ECMAScript 6 features except for modules.
        jest: true, // Jest global variables like `it` etc.
        node: true, // Defines things like process.env when generating through node
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'eslint:recommended',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'import', // eslint-plugin-import plugin. https://www.npmjs.com/package/eslint-plugin-import
        'import-newlines',
    ],
    globals: {
        JSX: true,
        NodeJS: true,
    },
    rules: {
        'linebreak-style': [
            'error',
            'unix',
        ],
        'complexity': [
            'error',
            13,
        ],
        'eqeqeq': [
            'error',
        ],
        'comma-dangle': [
            'warn',
            'always-multiline',
        ],
        'eol-last': 'error',
        'import/order': 'off',
        indent: [
            'error',
            4,
        ],
        'max-len': [
            'warn',
            {
                code: 180,
            },
        ],
        'no-console': 'warn',
        'import/no-duplicates': 'warn',
        'no-unused-vars': 'off',
        'object-curly-spacing': [
            'warn',
            'always',
        ],
        quotes: [
            'warn',
            'single',
            { 'avoidEscape': true },
        ],
        semi: ['warn', 'never'],
        'import-newlines/enforce': [
            'error',
            {
                'items': 2,
                'max-len': 100,
                'semi': false,
            },
        ],

    },
}

