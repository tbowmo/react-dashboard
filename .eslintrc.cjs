module.exports = {
    env: {
        browser: true, // Browser global variables like `window` etc.
        commonjs: true, // CommonJS global variables and CommonJS scoping.Allows require, exports and module.
        es6: true, // Enable all ECMAScript 6 features except for modules.
        jest: true, // Jest global variables like `it` etc.
        node: true, // Defines things like process.env when generating through node
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:react-hooks/recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'react',
        'import', // eslint-plugin-import plugin. https://www.npmjs.com/package/eslint-plugin-import
        'import-newlines',
    ],
    globals: {
        JSX: true,
        NodeJS: true,
    },
    root: true, // For configuration cascading.
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
        'react/display-name': 'off',
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
        'react/jsx-curly-brace-presence': [
            'warn',
            { props: 'never', children: 'never' },
        ],
        'react/jsx-curly-spacing': 'warn',
        'react/jsx-filename-extension': [
            'error',
            {
                extensions: [
                    '.ts',
                    '.tsx',
                ],
            },
        ],
        'react/jsx-indent': 'warn',
        'react/jsx-indent-props': 'warn',
        'react/prop-types': 'warn',
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
    settings: {
        react: {
            version: 'detect', // Detect react version
        },
    },
}

