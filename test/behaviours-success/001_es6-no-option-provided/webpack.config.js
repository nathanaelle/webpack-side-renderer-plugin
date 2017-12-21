var WebpackSideRenderer = require('../../../').default;
var pathJoin = require('path').join;

module.exports = {
	entry: pathJoin(__dirname, 'index.js'),

	output: {
		filename: 'index.js',
		path: pathJoin(__dirname, 'actual-output'),
		libraryTarget: 'umd2'
	},

	plugins: [
		new WebpackSideRenderer()
	],
};
