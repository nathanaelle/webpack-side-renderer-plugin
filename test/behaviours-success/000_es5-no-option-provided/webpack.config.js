var WebpackSideRenderer = require('../../../').default;

module.exports = {
  entry: __dirname + '/index.js',

  output: {
    filename: 'index.js',
    path: __dirname + '/actual-output',
    libraryTarget: 'umd'
  },

  plugins: [
    new WebpackSideRenderer(),
  ]
};
