
# WebPack Side Renderer Plugin

[![License](http://img.shields.io/badge/license-Simplified_BSD-blue.svg?style=flat)](LICENSE.txt) [![Build Status](https://travis-ci.org/nathanaelle/webpack-side-rendering-plugin.svg?branch=master)](https://travis-ci.org/nathanaelle/webpack-side-rendering-plugin)

## Install

```bash
$ yarn add -D webpack
$ yarn add -D webpack-side-renderer-plugin
```

## Usage

### webpack.config

```js
import WebpackSideRenderer from 'webpack-side-renderer-plugin'

const config = {
	entry: './index.js',

	output: {
		filename: 'index.js',
		path: 'dist',
		libraryTarget: 'umd2'
	},

	plugins: [
		new WebpackSideRenderer({
			paths: [
				'/hello/',
				'/world/'
			],
		})
	]

};

export default config
```

### index.js

Sync rendering:

```js
export default (options) => {
  return '<html>' + options.path + '</html>';
};
```

Async rendering via promises:

```js
export default (options) => {
  return Promise.resolve('<html>' + options.path + '</html>');
};
```

## Multi rendering

If you need to generate multiple files per render, or you need to alter the path, you can return an object instead of a string, where each key is the path, and the value is the file contents:

```js
export default (options) => {
  return {
    '/': '<html>Home</html>',
    '/hello': '<html>Hello</html>',
    '/world': '<html>World</html>'
  };
};
```

Note that this will still be executed for each entry in your `paths` array in your plugin config.

## Default options

```ts

export	interface IRendererOptions {
	// list of the available assets 
	// IAssetsIndex is a hash of IAsset
	assets: bc.IAssetsIndex

	// The path currently being rendered:
	path: string
	
	// the public prefix mean the same thing as webpack.output.publicPath but this value is local to this instance
	publicPrefix: string
}

export interface IAsset {
	chunkname: string
	filename: string
	// supplemental asset attribute exported with exportAttrs
	[name: string]: any
}



```

Any additional locals provided in your config are also available.

## Custom file names

By providing paths that end in `.html`, you can generate custom file names other than the default `index.html`. Please note that this may break compatibility with your router, if you're using one.

```js
module.exports = {

  ...

  plugins: [
    new WebpackSideRenderer({
      paths: [
        '/index.html',
        '/news.html',
        '/about.html'
      ]
    })
  ]
};
```


## React + Redux with multiple JS assets (commonChunks / vendor / manifest) support


react.jsx
```jsx
function bootstap() {
	return	(
		<App />
	)
}

if (!window.hasOwnProperty('_runScripts')) {
	React.render( bootstrap(), global.document.getElementById('reactroot') );
}

export default (data) => {
	const assets = Object.values(options.assets)
	const js = assets.filter(asset => asset.filename.match(/\.js$/)).map(asset => ('<script src="'+asset.filename+'"></script>')).join('')

	const html = ReactDOMServer.renderToString(bootstrap())
	const preloadedState = JSON.stringify(reduxStore.getState()).replace(/</g, '\\u003c')
return	(
`<!DOCTYPE html>
<html><head>
<meta charset="utf8">
<script>window.__PRELOADED_STATE__ = ${preloadedState};</script>
</head><body>
<div id="reactroot">${html}</div>
${js}
</body></html>`
	)
}
```

## Specifying entry

This plugin defaults to the first chunk found. While this should work in most cases, you can specify the entry name if needed:

```js
module.exports = {
  ...,
  plugins: [
    new WebpackSideRenderer({
      entry: 'main'
    })
  ]
}
```
