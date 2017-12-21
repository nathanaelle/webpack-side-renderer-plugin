import { hello } from './common'

function pathforUrl(p) {
	if( p.split('/').length < 3) {
		return	['1', '2', '3'].map((x) => (p+x+'/'))
	}
	if (p.match(/\d\.html$/)) {
		return []
	}
	return	['1', '2', '3'].map((x) => (p+x+'.html'))
}

export function pathExtractor(assets) {
	let ret = []
	let stack = pathforUrl('/')

	while(stack.length > 0) {
		const p = stack.shift()
		ret.push(p)
		stack = stack.concat(pathforUrl(p))
	}
	return	ret
}

export default (options) => {
	const assets = Object.values(options.assets)
	const js = assets.filter(asset => asset.filename.match(/\.js$/)).map(asset => ('<script src="'+asset.filename+'"></script>')).join('');

	const suburls = pathforUrl(options.path)

	if (suburls.length > 0 ) {
		const links = suburls.map((l) => `<li><a href="${ l }">${ l }</a></li>` ).join('')

		return	Promise.resolve(
			`<html>
				<body>
					<h1>/ is home</h1>
					<p>${ hello(options.path) }</p>
					<ul>
					${ links }
					</ul>
				</body>
				${ js }
			</html>`.replace(/[\r\n\t]+/g, ''))
	}

	return	Promise.resolve(
		`<html>
			<body>
				<h1>/ is home</h1>
				<p>final ${ hello(options.path) }</p>
			</body>
			${ js }
		</html>`.replace(/[\r\n\t]+/g, ''))
}
