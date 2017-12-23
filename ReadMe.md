
# WebPack Side Rendering Plugin

[![License](http://img.shields.io/badge/license-Simplified_BSD-blue.svg?style=flat)](LICENSE.txt) [![Build Status](https://travis-ci.org/nathanaelle/webpack-side-rendering-plugin.svg?branch=master)](https://travis-ci.org/nathanaelle/webpack-side-rendering-plugin)

## Install

```bash
 ~$ yarn add -D webpack
 ~$ yarn add -D webpack-side-rendering-plugin
```

## Usage

### webpack.config

```js
import WebpackSideRendering from 'webpack-side-rendering-plugin'

const config = {
	entry: './index.js',

	output: {
		filename: 'index.js',
		path: 'dist',
		libraryTarget: 'umd2'
	},

	plugins: [
		new WebpackSideRendering({
			paths: [
				'/hello/',
				'/world/'
			],
		})
	]

};

export default config
```

### Plugin Options

```ts

export interface IOptions {
	// remove an asset from webpack after the execution of this instance
	dropAssets?: string[]|string

	// name of the webpack entry where this instance will be applied
	entry?:	string

	// attributes from webpack's assets that will be exposed to this instance
	exportAttrs?: string[]|string

	// predefined list of paths for this instance.
	// pathsFunc may complete the list
	paths?: string[]|string

	// name of the exported function that provide the list of paths for this instance
	pathsFunc?: string|false

	// publicPath of this instance
	publicPrefix?: string
}

```


### Renderer export

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

### Default options for renderer

```ts

export	interface IRenderingOptions {
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


## React + Redux with multiple JS assets (commonChunks / vendor / manifest) support

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
