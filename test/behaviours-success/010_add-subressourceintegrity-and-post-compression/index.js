export default (options) => {
	const assets = Object.values(options.assets)
	const js = assets.filter(asset => asset.filename.match(/\.js$/))
		.map(asset => (
			`<script src="${ asset.filename }" integrity="${ asset.integrity }" crossorigin="anonymous"></script>`
		))
		.join('')

	return	(
`<html>
	<body>
		<p>${ options.path }</p>
	</body>
	${ js }
</html>
`)
};
