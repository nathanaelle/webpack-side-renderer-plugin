import	{ hello }	from './common'


export default (options) => {
	const assets = Object.values(options.assets)
	const js = assets.filter(asset => asset.filename.match(/\.js$/)).map(asset => ('<script src="'+asset.filename+'"></script>')).join('')

	if ( options.path === '/blog/') {
		return	(
`<html>
	<body>
		<h1>${ options.path } is blog</h1>
		<p>${ hello(options.path) }</p>
	</body>
	${ js }
</html>
`)
	}

	return	(
`<html>
	<body>
		<h1>${ options.path } is article</h1>
		<p>${ hello(options.path) }</p>
	</body>
	${ js }
</html>
`)
};
