module.exports = {
    env: {
        browser: true, // Browser global variables like `window` etc.
        commonjs: true, // CommonJS global variables and CommonJS scoping.Allows require, exports and module.
        es2020: true, // Enable all ECMAScript 6 features except for modules.
        jest: true, // Jest global variables like `it` etc.
    },
    extends: [
        'plugin:react/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:react-hooks/recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'react',
        'react-refresh'
    ],
    globals: {
        JSX: true,
        NodeJS: true,
    },
    rules: {
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',
        'react/display-name': 'off',
        'react/jsx-curly-brace-presence': [
            'warn',
            { props: 'never', children: 'never' },
        ],
        'react/jsx-curly-spacing': 'warn',
        'react/jsx-filename-extension': [
            'error',
            {
                extensions: [
                    '.tsx',
                ],
            },
        ],
        'react/jsx-indent': 'warn',
        'react/jsx-indent-props': 'warn',
        'react/prop-types': 'warn',
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
    },
    settings: {
        react: {
            version: 'detect', // Detect react version
        },
    },
}

