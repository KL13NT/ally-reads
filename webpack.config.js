/* eslint-env node */
/* eslint-disable no-unused-vars */

const path = require('path')
const webpack = require('webpack')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const CompressionPlugin = require('compression-webpack-plugin')


module.exports = (env, argv) => {
	const sharedConf = {
		devtool: argv.mode === 'development'? 'inline-source-map': '',
		target: 'web',
		module: {
			rules: [
				{
					test: /\.jsx?$/i,
					exclude: path.resolve(__dirname, 'node_modules'),
					use: [
						'babel-loader',
						{
							loader: 'eslint-loader',
							options: {
								fix: true,
								cache: true,
								failOnWarning: false,
								failOnError: true
							}
						}
					]
				}
			]
		},

		optimization: {
			minimizer: [
				// new OptimizeCssAssets(),
				new UglifyJsPlugin({
					cache: true,
					parallel: true,
					sourceMap: false
				})
			]
		}
	}

	const sharedOutputConf = {
		filename: '[name].js'
	}

	const shareableConf = {
		...sharedConf,

		entry: {
			content_script: path.resolve(__dirname, './src/content_script.js'),
			installation: path.resolve(__dirname, './src/installation.js'),
			toggler: path.resolve(__dirname, './src/toggler.js')
		},

		output: {
			...sharedOutputConf,
			path: path.resolve(__dirname, 'dist')
		}
	}

	const optionsUI = {
		...sharedConf,
		entry: path.resolve(__dirname, './src/options/optionsUI.js'),
		output: {
			...sharedOutputConf,
			path: path.resolve(__dirname, 'dist/optionsUI'),
			filename: 'optionsUI.js'
		}
	}

	const browserAction = {
		...sharedConf,

		entry: path.resolve(__dirname, './src/browserAction/browserAction.js'),
		output: {
			...sharedOutputConf,
			path: path.resolve(__dirname, 'dist/browserAction'),
			filename: 'browserAction.js'
		}
	}

	return (
		[
			shareableConf, optionsUI, browserAction
		]
	)
}