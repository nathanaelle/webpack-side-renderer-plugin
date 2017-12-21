var WebpackSideRenderer = require('../../../').default;

module.exports = {

  entry: {
    main: __dirname + '/index.js'
  },

  output: {
    filename: 'index.js',
    path: __dirname + '/actual-output',
    publicPath: '/',
    libraryTarget: 'umd'
  },

  plugins: [
    new WebpackSideRenderer({
	    entry: 'main',
	    path: ['/']
	})
  ]

};
