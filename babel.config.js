module.exports = function (api) {
	api.cache(true)

	const presets = [
		'@babel/preset-env'
	]

	const plugins = [
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-syntax-dynamic-import',
		[
			'@babel/plugin-proposal-pipeline-operator',
			{
				proposal: 'fsharp'
			}
		],
		'@babel/plugin-transform-runtime',
		'@babel/plugin-proposal-optional-catch-binding'
	]

	return {
		presets,
		plugins
	}
}