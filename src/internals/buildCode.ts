export interface IAsset {
	chunkname: string
	filename: string
	[name: string]: any
}

export interface IAssetsIndex {
	[name: string]: IAsset
}

export interface ISourceCodeAndAssets {
	sourceCode: string
	assets: IAssetsIndex
}

export function BuildSourceCodeAndAssets(entry: string, attrs: string[], compilation: any): ISourceCodeAndAssets {
	const publicPath = publicPathname(compilation.options.output.publicPath)

	if (entry === '') {
		entry = (Object.keys(compilation.entrypoints))[0]
	}

	if (!compilation.entrypoints.hasOwnProperty(entry)) {
		throw new Error('Source file not found: "' + entry + '"')
	}

	const chunksOrder = indexEntryPoint(entry, compilation)

	const jsfiles = AssetsFilesByLoadOrder(compilation, chunksOrder)
	const assets = LoadableAssets(jsfiles, publicPath, chunksOrder)
			.map(exportAttrs(attrs, compilation))
			.reduce(exportAsset, {} as IAssetsIndex)

	const sourceCode = SourceCodeFromFiles(jsfiles, compilation)

	return	{ assets, sourceCode }
}

function LoadableAssets(jsFile: string[], publicPath: pathRewriter, chunksOrder: IChunkOrder): IAsset[] {
	return jsFile
	.map((file: string): IAsset => {
		const chunkname = chunksOrder.file2chunk[file]
		const filename = publicPath(file)
		return	{ chunkname, filename }
	})
}

type pathRewriter = (file: string) => string

function publicPathname(publicPrefix: string|undefined|null): pathRewriter {
	if (publicPrefix === null || publicPrefix === undefined || publicPrefix === '') {
		return (file) => file
	}
	return (file) => (publicPrefix + file)
}

function exportAttrs(toExportAttrs: string[], compilation: any): ((asset: IAsset) => IAsset) {
	const	assets = compilation.assets
	return (asset: IAsset): IAsset => {
		toExportAttrs.forEach((attr) => {
			const sourceAsset = assets[asset.filename]
			if (sourceAsset.hasOwnProperty(attr)) {
				asset[attr] = sourceAsset[attr]
			}
		})
		return	asset
	}
}

function exportAsset(assets: IAssetsIndex, asset: IAsset): IAssetsIndex {
	assets[asset.filename] = asset
	return	assets
}

interface IChunkOrder {
	chunk2pos: {
		[chunk: number]: number,
	}
	pos2chunk: {
		[pos: number]: number,
	},
	name2pos: {
		[name: string]: number,
	},
	name2chunk: {
		[name: string]: number,
	},
	file2chunk: {
		[name: string]: string,
	}
}

function indexEntryPoint(entry: string, compilation: any): IChunkOrder {
	const	emptyIndex: IChunkOrder = {
		chunk2pos: {},
		file2chunk: {},
		name2chunk: {},
		name2pos: {},
		pos2chunk: {},
	}

	return	compilation.entrypoints[entry].chunks
		.map(prepareIChunkIndex)
		.reduce(assembleChunkIndex, emptyIndex)
}

interface IChunkIndex {
	name: string
	id: number
	pos: number
	files: string[]
}

function prepareIChunkIndex(e: any, pos: number): IChunkIndex {
	const name: string = e.name
	const id: number = e.id
	let files = e.files
	if (!(e.files instanceof Array)) {
		files = [ files ]
	}

	return { name, id, pos, files }
}

function assembleChunkIndex(hash: IChunkOrder, e: IChunkIndex): IChunkOrder {
	hash.chunk2pos[e.id] = e.pos
	hash.pos2chunk[e.pos] = e.id
	hash.name2chunk[e.name] = e.id
	hash.name2pos[e.name] = e.pos

	e.files.forEach((file: string) => {
		hash.file2chunk[file] = e.name
	})
	return	hash
}

function AssetsFilesByLoadOrder(compilation: any, chunksOrder: IChunkOrder): string[] {
	return	Object.keys(compilation.assets)
		.map(nameToIAssetDescriptor(chunksOrder))
		.filter(noSortableAsset)
		.sort(byAssetOrder)
		.map(getAssetName)
}

interface IAssetDescriptor {
	name:	string
	pos:	number
	order:	number
}

function nameToIAssetDescriptor(chunksOrder: IChunkOrder): ((name: string, pos: number) => IAssetDescriptor) {
	return	(name: string, pos: number): IAssetDescriptor => {
		const order: number = chunksOrder.chunk2pos[pos]
		return { name, pos, order }
	}
}

function noSortableAsset(e: IAssetDescriptor) {
	return	e.order !== undefined
}

type	sortedReturn	= 1|0|-1
function byAssetOrder(a: IAssetDescriptor, b: IAssetDescriptor): sortedReturn {
	if (a.order < b.order) {
		return -1
	}
	if (a.order > b.order) {
		return 1
	}
	return 0
}

function getAssetName(e: IAssetDescriptor): string {
	return e.name
}

function SourceCodeFromFiles(files: string[], compilation: any): string {
	return files.map((name: string) => {
		let myChunk = compilation.assets[name]
		if (myChunk instanceof Array) {
			myChunk = myChunk[0]
		}
		if (myChunk instanceof Object) {
			myChunk = myChunk.source()
		}
		return	myChunk
	}).join('\n\n')
}
