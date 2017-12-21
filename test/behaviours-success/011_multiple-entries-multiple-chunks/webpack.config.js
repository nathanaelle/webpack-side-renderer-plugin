var webpack = require('webpack')
var WebpackSideRenderer = require('../../../').default;
var pathJoin = require('path').join;

module.exports = {
	entry: {
		home: pathJoin(__dirname, 'index.js'),
		blog: pathJoin(__dirname, 'blog.js'),
	},
	output: {
		filename: '[name]_[chunkhash:8].js',
		path: pathJoin(__dirname, 'actual-output'),
		publicPath: '/',
		libraryTarget: 'umd2',
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'common',
			chunks: [ 'home', 'blog' ],
			minChunks: 2,
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			minChunks: Infinity,
		}),
		new WebpackSideRenderer({
			entry: 'home'
		}),
		new WebpackSideRenderer({
			entry: 'blog',
			paths: [ '/blog/', '/blog/article1.html', '/blog/article2.html' ]
		}),
	]
};

