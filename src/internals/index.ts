import	{ JSDOM, VirtualConsole }	from 'jsdom'
import	{ join as path_join }		from 'path'
import	{ normalize as path_normalize }	from 'path'
import	{ Script }			from 'vm'
import	{ RawSource }			from 'webpack-sources'

import	* as bc				from './buildCode'

export	const BuildSourceCodeAndAssets = bc.BuildSourceCodeAndAssets
export	type IAsset = bc.IAsset
export	type IAssetsIndex = bc.IAssetsIndex
export	type ISourceCodeAndAssets = bc.ISourceCodeAndAssets

export	interface IRendererOptions {
	assets: bc.IAssetsIndex
	path: string
	publicPrefix: string
}

export	interface IRendererMultipleOutput {
	[file: string]: string
}

export	type RendererOutputRaw = string|IRendererMultipleOutput
export	type RendererOutput = RendererOutputRaw|Promise<RendererOutputRaw>
export	type Renderer = (options: IRendererOptions) => RendererOutput

export function CompileAndGetDOM(entry: string, sourceCode: string): JSDOM {
	const virtualConsole = new VirtualConsole()

	virtualConsole.on('debug',	(m: any, args: any) => (args === undefined ? console.debug(m) : console.debug(m, args)))
	virtualConsole.on('error',	(m: any, args: any) => (args === undefined ? console.error(m) : console.error(m, args)))
	virtualConsole.on('info',	(m: any, args: any) => (args === undefined ? console.info(m) : console.info(m, args)))
	virtualConsole.on('warn',	(m: any, args: any) => (args === undefined ? console.warn(m) : console.warn(m, args)))
	virtualConsole.on('log',	(m: any, args: any) => (args === undefined ? console.log(m) : console.log(m, args)))

	const options: any = {
		pretendToBeVisual: true,
		runScripts: 'outside-only',
		virtualConsole,

		beforeParse(window: any) {
			if (!window.hasOwnProperty('localStorage')) {
				window.localStorage = (((localStore: {[key: string]: string}): any => {
					return {
						getItem(key: string): string {
							return localStore[key]
						},
						setItem(key: string, value: string) {
							localStore[key] = value
						},
						removeItem(key: string) {
							delete this[key]
						},
					}
				})({}))
			}
		},
	}

	const	dom = new JSDOM('', options)

	try {
		dom.runVMScript(new Script(sourceCode))
		const window = (dom.window as any)

		if (!window.hasOwnProperty('default') || typeof window.default !== 'function') {
			throw new Error('Default export from "' + entry + '" must be a function.')
		}

		return	dom
	} catch (err) {
		throw err
	}
}

export function renderPaths(
		paths: string[], wsr: Renderer,
		coreOptions: IRendererOptions, compilation: any): Promise<string[]> {
	const	renderPromises = paths.map((outputPath: string) => {
		const options: IRendererOptions = Object.assign(coreOptions, { path: outputPath })

		return	buildPromiseForPath(options, wsr)
			.then(storeStaticFile(compilation))
			.catch((err) => {
				compilation.errors.push(err.stack)
			})
		})

	return	Promise.all(renderPromises)
		.then((alls: Array<void|ICrawlable[]>): string[] => {
			return	[].concat.call([], alls).filter((e) => (typeof e === 'string'))
		})
}

function buildPromiseForPath(options: IRendererOptions, ssr: Renderer): Promise<IRendererMultipleOutput> {
	return	new Promise((resolve, reject) => {
		try {
			resolve(getIMultipleOutput(options.path, ssr(options)))
		} catch (err) {
			// console.log(['defaultFunc', err])
			reject(err)
		}
	})
}

interface ICrawlable {
	assetName: string
	source: string
}

function storeStaticFile(compilation: any): ((output: IRendererMultipleOutput) => ICrawlable[]) {
	return	(output: IRendererMultipleOutput): ICrawlable[] => {
		return	Object.keys(output)
			.map(prepareAsset(output))
			.filter(removeAlreadySetAsset(compilation.assets))
			.map(({ key, rawSource, assetName, source }): ICrawlable => {
				compilation.assets[assetName] = rawSource
				return	{ assetName, source }
			})
	}
}

function prepareAsset(output: IRendererMultipleOutput) {
	return	(key: string) => {
		const source	= output[key]
		const rawSource = new RawSource(source)
		const assetName = normalizeAssetName(key)
		return	{ key, rawSource, assetName, source }
	}
}

function removeAlreadySetAsset(assets: any) {
	return	( { assetName } ) => !assets.hasOwnProperty(assetName)
}

function normalizeAssetName(rawPath: string): string {
	const relativePath = path_normalize(rawPath.replace(/^[\/\\]+/, ''))

	if (relativePath.toLowerCase().match(/\.html?$/) ) {
		return	relativePath
	}
	return	path_join(relativePath, 'index.html')

}

function isIRendererMultipleOutput(v: any): v is IRendererMultipleOutput {
	const irmo = v as IRendererMultipleOutput
	return typeof irmo === 'object'
}

function isPromiseAny(v: any): v is Promise<IRendererMultipleOutput|string> {
	const prom = v as Promise<IRendererMultipleOutput|string>
	return	prom.then !== undefined
}

function getIMultipleOutput(key: string, output: any): Promise<IRendererMultipleOutput> {
	if (isPromiseAny(output)) {
		const prom =	output as Promise<IRendererMultipleOutput|string>
		return	prom.then((el: IRendererMultipleOutput|string): IRendererMultipleOutput => {
			if (isIRendererMultipleOutput(el)) {
				const irmo = el as IRendererMultipleOutput
				return irmo
			}

			const pobj: IRendererMultipleOutput = {}
			pobj[key] = el
			return pobj
		})
	}

	if (isIRendererMultipleOutput(output)) {
		const irmo = output as IRendererMultipleOutput
		return Promise.resolve(irmo)
	}

	const obj: IRendererMultipleOutput = {}
	obj[key] = output
	return Promise.resolve(obj)
}
