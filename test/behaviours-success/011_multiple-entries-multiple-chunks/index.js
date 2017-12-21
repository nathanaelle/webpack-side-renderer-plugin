import	{ hello }	from './common'


export default (options) => {
	const assets = Object.values(options.assets)
	const js = assets.filter(asset => asset.filename.match(/\.js$/)).map(asset => ('<script src="'+asset.filename+'"></script>')).join('')

	return	{
'/': `<html>
	<body>
		<h1>/ is home</h1>
		<p>${ hello(options.path) }</p>
	</body>
	${ js }
</html>
`,
'/info.html': `<html>
	<body>
		<h1>/info.html is home</h1>
		<p>${ hello('/info.html') }</p>
	</body>
	${ js }
</html>
`,
	}
};
