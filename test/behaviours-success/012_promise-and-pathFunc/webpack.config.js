var webpack = require('webpack')
var WebpackSideRenderer = require('../../../').default;
var pathJoin = require('path').join;

module.exports = {
	entry: {
		home: pathJoin(__dirname, 'index.js'),
	},
	output: {
		filename: '[name]_[chunkhash:8].js',
		path: pathJoin(__dirname, 'actual-output'),
		publicPath: '/',
		libraryTarget: 'umd2',
	},

	plugins: [
		new WebpackSideRenderer({
			entry: 'home',
			paths: '/',
			pathsFunc: 'pathExtractor'
		}),
	]
};
