module.exports = {
    'env': {
        'browser': true,
        'es6': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/eslint-recommended'
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'plugins': [
        'react',
        '@typescript-eslint'
	],
	'settings': {
		'react': {
			'createClass': 'createReactClass', // Regex for Component Factory to use,
											   // default to 'createReactClass'
			'pragma': 'React',  // Pragma to use, default to 'React'
			'version': 'detect', // React version. 'detect' automatically picks the version you have installed.
								 // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
								 // default to latest and warns if missing
								 // It will default to 'detect' in the future
			'flowVersion': '0.53' // Flow version
		  },
		  'propWrapperFunctions': [
			  // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
			  'forbidExtraProps',
			  {'property': 'freeze', 'object': 'Object'},
			  {'property': 'myFavoriteWrapper'}
		  ],
		  'linkComponents': [
			// Components used as alternatives to <a> for linking, eg. <Link to={ url } />
			'Hyperlink',
			{'name': 'Link', 'linkAttribute': 'to'}
		  ]
	},
    'rules': {
        'no-unused-vars': 'off',
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ],
            		/* typescript */
		'@typescript-eslint/array-type': 'off',
		'@typescript-eslint/camelcase': ['off', { // We have some types fromt the API that aren't fully CamelCase
			properties: 'never', // 'never enforce', not 'never allow'
		}],
		'@typescript-eslint/prefer-interface': 'off',
		'@typescript-eslint/indent': 'off',
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-object-literal-type-assertion': 'off',
		'@typescript-eslint/no-use-before-define': 'warn',

        '@typescript-eslint/no-unused-vars': ['warn', {
			vars: 'all',
			args: 'after-used',
			ignoreRestSiblings: true,
        }],
        '@typescript-eslint/member-delimiter-style': ['warn', {
			multiline: {
				delimiter: 'comma',
				requireLast: true,
			},
			singleline: {
				delimiter: 'comma',
				requireLast: false,
			},
        }],
        		/* core */
		'arrow-body-style': 'off',
		'arrow-parens': ['error', 'always'],
		'array-callback-return': 'warn',
		'consistent-return': 'off',
		'camelcase': 'off', // handled by @typescript-eslint/camelcase
		'comma-spacing': ['warn', {
			before: false,
			after: true,
		}],
		'default-case': 'off',
		'quote-props': ['error', 'consistent-as-needed'],
		'func-call-spacing': 'off', // Gets confused about generics sometimes
		'no-spaced-func': 'off', // Gets confused about generics
		'comma-dangle': ['error', 'always-multiline'],
		'semi': ['error', 'never'],
		'function-paren-newline': ['warn', 'consistent'],
		'func-names': 'warn',
		'global-require': 'warn',
		'no-console': 'error',
		'no-extra-boolean-cast': 'off',
		'no-await-in-loop': 'off',
		'no-tabs': 'off',
		'no-else-return': 'off',
		'no-nested-ternary': 'off',
		'no-continue': 'off',
		'no-useless-escape': 'warn',
		'no-useless-return': 'warn',
		'no-useless-constructor': 'warn',
		'no-irregular-whitespace': 'warn',
		'no-restricted-syntax': [
			'error',
			{
				selector: 'ForInStatement',
				message: 'Use Object.keys or Object.entries instead of for .... in',
			},
			{
				selector: 'LabeledStatement',
				message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
			},
			{
				selector: 'WithStatement',
				message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
			},
		],
		'no-return-assign': 'warn',
		'object-property-newline': 'warn',
		'operator-linebreak': ['warn', 'before'],
		'prefer-destructuring': 'off', // or do we?
		'max-len': ['error', 150],
		'newline-per-chained-call': [
			'warn',
			{
				ignoreChainWithDepth: 3,
			},
		],
		'no-dupe-class-members': 'off', // Would be a good idea, but TS's method overrides make it impossible for now
		'no-plusplus': 'off',
		'no-unused-vars': 'off', // handled by @typescript/no-unused-vars
		'no-unneeded-ternary': 'off',
		'no-use-before-define': 'off', // handled by @typescript/no-use-before-define
		'no-underscore-dangle': 'off', // Still don't do it though
		'no-multi-spaces': 'warn',
		'no-return-await': 'off',
		'no-prototype-builtins': 'off', // Consider impact of enabling
		'object-curly-spacing': [
			'warn',
			'always',
		],
		'prefer-arrow-callback': ['error', {
			allowNamedFunctions: true,
		}],
		'implicit-arrow-linebreak': 'off',
		'template-curly-spacing': 'warn',
		'space-before-function-paren': 'off',
		'keyword-spacing': 'warn',
		'lines-between-class-members': 'off',
		'padded-blocks': 'off',
		'object-curly-newline': ['warn', {
			ObjectExpression: {
				consistent: true,
			},
			ObjectPattern: {
				consistent: true,
			},
			ExportDeclaration: {
				consistent: true,
			},
			ImportDeclaration: {
				minProperties: 3,
				consistent: true,
			},
		}],
		'operator-assignment': 'off',
		'sort-imports': 'off', // Unfortunately, this doesn't fully match tslint's 'order-import'
		'spaced-comment': 'off',
		'space-after-function-name': 0,

		/* import */
		'import/order': 'off', // @todo: Configure and turn on if it can match tslint's settings
		'import/export': 'off', // Would be a good idea, but TS's method overrides make it impossible for now
		'import/named': 'off', // @fixme: Doesn't work with TS atm, see: https://github.com/benmosher/eslint-plugin-import/pull/1304
		'import/no-named-as-default': 'off', // Not practical when exporting non-connected version of component
		'import/prefer-default-export': 'off',

		/* React */
		'react/button-has-type': [
			'warn',
			{
				button: true,
				submit: true,
				reset: true,
			},
		],
		'react/jsx-wrap-multilines': [
			'warn',
			{
				declaration: 'parens-new-line',
				assignment: 'parens-new-line',
				return: 'parens-new-line',
				arrow: 'parens-new-line',
				condition: 'parens-new-line',
				logical: 'parens-new-line',
				prop: 'parens-new-line',
			},
		],
		'react/destructuring-assignment': 'off',
		'react/sort-comp': 'off',
		'react/jsx-boolean-value': ['error', 'always'],
		'react/jsx-closing-tag-location': 'warn', // @fixme: Should become error asap
		'react/jsx-filename-extension': ['error', {
			extensions: ['.tsx'],
		}],
		'react/jsx-indent-props': ['error', 4],
		'react/jsx-no-target-blank': 'off', // @fixme: Consider turning this on
		'react/jsx-tag-spacing': [
			'warn',
			{
				closingSlash: 'never',
				beforeSelfClosing: 'always',
				afterOpening: 'never',
				beforeClosing: 'never',
			},
		],
		'react/jsx-curly-brace-presence': [
			'warn',
			{
				props: 'never',
				children: 'never',
			},
		],
		'react/jsx-one-expression-per-line': [
			'off',
		],
		'react/no-array-index-key': 'warn', // @fixme: Turn on asap
		'react/prefer-stateless-function': 'off', // but do consider enabling
		'react/prop-types': 'off', // @todo: consider turning this on
		'react/no-multi-comp': 'off',
		'react/no-did-update-set-state': 'warn',
		'react/no-unused-state': 'warn',
		'react/no-unknown-property': 'off', // too many false positives
		'react/no-unescaped-entities': 'off',
		'react/no-children-prop': 'warn',
		'react/jsx-props-no-multi-spaces': 'warn',
    }
}