import * as path	from 'path'
import * as repl	from 'repl'
import * as webpack	from 'webpack'

const	nativeModules: string[] = (repl as any)._builtinLibs

const isNodeNative = (k: string) => {
	return (elem: string): boolean => {
		return k === elem
	}
}

const config: webpack.Configuration = {
	devtool: 'source-map',
	entry: {
		'wsr-plugin': './src/index.ts',
	},
	externals: (context: string, request: string, callback: any) => {
		// process.env.hasOwnProperty('NODE_ENV') && process.env.NODE_ENV === 'development' &&
		if (request === 'jsdom') {
			return	callback(null, 'commonjs2 ' + request)
		}

		if (nativeModules.some(isNodeNative(request))) {
			return	callback(null, 'commonjs2 ' + request)
		}

		callback()
	},
	module: {
		rules: [
			{
				exclude: [ /node_modules/, /test/ ],
				include: [ path.resolve(__dirname, 'src') ],
				test: /\.ts$/,
				use: [ 'babel-loader', 'ts-loader' ],
			},
			{
				enforce: 'pre',
				exclude: [ /node_modules/, /test/ ],
				test: /\.js$/,
				use: [ 'source-map-loader' ],
			},
		],
	},
	output: {
		filename: '[name].js',
		libraryTarget: 'commonjs2',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
	],
	resolve: {
		extensions: [ '.js', '.ts' ],
		modules: [ path.resolve(__dirname, 'node_modules') ],
	},
	target: 'node',
}

export default config
