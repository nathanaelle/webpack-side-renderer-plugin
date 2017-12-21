import { JSDOM }		from 'jsdom'
import	{ Compiler, Plugin }	from 'webpack'
import	* as internals		from './internals'

export	type IRendererOptions		= internals.IRendererOptions
export	type Renderer			= internals.Renderer
export	type RendererOutput		= internals.RendererOutput
export	type RendererOutputRaw		= internals.RendererOutputRaw
export	type IRendererMultipleOutput	= internals.IRendererMultipleOutput

export interface IOptions {
	dropAssets?: string[]|string
	entry?:	string
	exportAttrs?: string[]|string
	paths?: string[]|string
	pathsFunc?: string|false
	publicPrefix?: string
	hasOwnProperty(key: string): boolean
}

export default class WebpackSideRenderer implements Plugin {
	private	dropAssets: string[]
	private	entry: string
	private	exportAttrs: string[]
	private	paths: string[]
	private pathsFunc: undefined | string
	private publicPrefix: string

	constructor(options?: IOptions) {
		if (options === undefined) {
			this.dropAssets = []
			this.entry = ''
			this.exportAttrs = []
			this.paths =  [ '/' ]
			this.pathsFunc = undefined
			this.publicPrefix = ''
			return
		}

		this.dropAssets = paramArray(options, 'dropAssets', [])
		this.entry = options.entry || ''
		this.exportAttrs = paramArray(options, 'exportAttrs', [])
		this.publicPrefix = options.publicPrefix || ''

		if ( !!options.pathsFunc && typeof options.pathsFunc === 'string') {
			this.pathsFunc = options.pathsFunc
		}

		if (this.pathsFunc === undefined) {
			this.paths = paramArray(options, 'paths', [ '/' ])
		} else {
			this.paths = paramArray(options, 'paths', [ ])
		}
	}

	public apply(compiler: Compiler): void {
		compiler.plugin('after-compile', this.handle_after_compile.bind(this))
	}

	private handle_after_compile(compilation: any, done: (err?: Error, result?: any, ...args: any[]) => void): void {
		try {
			const { sourceCode, assets } = internals.BuildSourceCodeAndAssets(this.entry, this.exportAttrs, compilation)
			const dom = internals.CompileAndGetDOM(this.entry, sourceCode)

			if (this.pathsFunc !== undefined) {
				this.paths = this.extractPaths(dom, this.pathsFunc, assets)
			}

			this.webpackSideRender(dom, assets, compilation)
				.then(() => done())
				.catch(done)

			this.dropAssets.forEach((toDelete) => {
				if (compilation.assets.hasOwnProperty(toDelete)) {
					delete	compilation.assets[toDelete]
				}
			})
		} catch (err) {
			compilation.errors.push(err.stack)
			done()
		}
	}

	private extractPaths(dom: JSDOM, attr: string, assets: internals.IAssetsIndex): string[] {
		if (!dom.window.hasOwnProperty(attr)) {
			return	this.paths
		}
		const pathsFunc = (dom.window as any)[attr]

		return	(pathsFunc(assets) as string[])
			.filter((e: string): boolean => !!e && typeof e === 'string')
			.concat(this.paths)
			.sort((a: string, b: string) => a.localeCompare(b))
			.reduce((paths: string[], p: string) => {
				const len = paths.length
				if (len === 0) {
					return [ p ]
				}
				if (paths[len - 1] === p) {
					return	paths
				}
				return paths.concat([ p ])
			}, [])
	}

	private webpackSideRender(dom: JSDOM, assets: internals.IAssetsIndex, compilation: any): Promise<string[]> {
		const	wsr: Renderer	= ((dom.window as any).default) as Renderer
		const	coreOptions: IRendererOptions = {
			assets,
			path: '',
			publicPrefix: this.publicPrefix,
		}

		return	internals.renderPaths(this.paths, wsr, coreOptions, compilation)
	}
}

function paramArray(options: IOptions, key: string,  fallback: string[]): string[] {
	if (!options.hasOwnProperty(key)) {
		return	fallback
	}
	const	val = options[key]
	if (val === undefined || val === null || val === '') {
		return	fallback
	}

	if (typeof val === 'string') {
		return	[ val ]
	}

	if (!Array.isArray(val)) {
		return	fallback
	}

	const	arrayVal = val.filter((el) => (el !== undefined && el !== null && typeof el === 'string'))
	if (arrayVal.length === 0) {
		return	fallback
	}

	return	arrayVal
}
