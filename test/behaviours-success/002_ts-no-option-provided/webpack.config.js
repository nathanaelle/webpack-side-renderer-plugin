var WebpackSideRenderer = require('../../../').default;

module.exports = {
	entry: __dirname + '/index.ts',

	output: {
		filename: 'index.js',
		path: __dirname + '/actual-output',
		libraryTarget: 'umd'
	},

	plugins: [
		new WebpackSideRenderer()
	],

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [ 'babel-loader', 'ts-loader' ],
				exclude: /node_modules/,
				include: [ __dirname ]				
			},
		]
	}
};
