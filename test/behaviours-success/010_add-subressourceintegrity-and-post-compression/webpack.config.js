var WebpackSideRenderer	= require('../../../').default;
var CompressionPlugin	= require('compression-webpack-plugin');
var SriPlugin		= require('webpack-subresource-integrity');

module.exports = {
	entry: __dirname + '/index.js',
	output: {
		filename: 'index.js',
		path: __dirname + '/actual-output',
		libraryTarget: 'umd'
	},

	plugins: [
		new SriPlugin({
			hashFuncNames: ['sha512']
		}),
		new WebpackSideRenderer({
			exportAttrs: 'integrity'
		}),
		new CompressionPlugin({
			asset: '[path].gz',
			algorithm: 'gzip',
			test: /\.html|js$/,
			threshold: 0,
			minRatio: 999
		})
	]
};
