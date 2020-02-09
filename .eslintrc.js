module.exports = {
	'env': {
		'browser': false,
		'commonjs': true,
		'es6': true,
		'node': true
	},
	"extends": [
		"eslint:recommended"
	],
	'parser': 'babel-eslint',
	'parserOptions': {
		'ecmaVersion': 10,
		'ecmaFeatures': {
			'jsx': true,
			'modules': true,
			'experimentalObjectRestSpread': true
		}
	},
	'plugins': [
	],
	'rules': {
		'indent': [
			'error',
			`tab`
		],
		'linebreak-style': [
			'error',
			'windows'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-unused-vars': [
			'error',
			{
				'varsIgnorePattern': 'Fragment'
			}
		],
		'quote-props': [
			"error",
			'consistent-as-needed',
			{
				'keywords': true
			}
		],
		'object-curly-spacing': [
			'error',
			'always'
		],
		'array-bracket-spacing': [
			'error',
			'always'
		],
		'no-whitespace-before-property': 2,
		'space-unary-ops': [
        2, {
          "words": true,
          "nonwords": false,
          "overrides": {
						"new": true,
						"=": true
          }
    }],
		"prefer-destructuring": ["warn", {
      "array": false,
      "object": true
			}, {
      "enforceForRenamedProperties": false
		}],
		"prefer-const": ["error", {
			"destructuring": "any",
			"ignoreReadBeforeAssign": false
    }],
		"space-before-function-paren": ["error", "always"],
		"comma-dangle": ["error", "never"],
		'react/prop-types': 0,
		'arrow-spacing': ['error', { "before": true, "after": true }],
		'block-spacing': [
			2,
			'always'
		],
		'no-unused-vars': 1
	},
};