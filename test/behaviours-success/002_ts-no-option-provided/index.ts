import	{ IRendererOptions, Renderer, RendererOutput }	from '../../../'

const renderer: Renderer = (options: IRendererOptions): RendererOutput => {
	return JSON.stringify(Object.keys(options as any))
}

export default renderer
