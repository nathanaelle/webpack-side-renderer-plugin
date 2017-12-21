/// <reference types="webpack" />
import { Compiler, Plugin } from 'webpack';
import * as internals from './internals';
export declare type IRendererOptions = internals.IRendererOptions;
export declare type Renderer = internals.Renderer;
export declare type RendererOutput = internals.RendererOutput;
export declare type RendererOutputRaw = internals.RendererOutputRaw;
export declare type IRendererMultipleOutput = internals.IRendererMultipleOutput;
export interface IOptions {
    dropAssets?: string[] | string;
    entry?: string;
    exportAttrs?: string[] | string;
    paths?: string[] | string;
    pathsFunc?: string | false;
    publicPrefix?: string;
    hasOwnProperty(key: string): boolean;
}
export default class WebpackSideRenderer implements Plugin {
    private dropAssets;
    private entry;
    private exportAttrs;
    private paths;
    private pathsFunc;
    private publicPrefix;
    constructor(options?: IOptions);
    apply(compiler: Compiler): void;
    private handle_after_compile(compilation, done);
    private extractPaths(dom, attr, assets);
    private webpackSideRender(dom, assets, compilation);
}
