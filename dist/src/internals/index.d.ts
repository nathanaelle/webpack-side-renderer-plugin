import { JSDOM } from 'jsdom';
import * as bc from './buildCode';
export declare const BuildSourceCodeAndAssets: typeof bc.BuildSourceCodeAndAssets;
export declare type IAsset = bc.IAsset;
export declare type IAssetsIndex = bc.IAssetsIndex;
export declare type ISourceCodeAndAssets = bc.ISourceCodeAndAssets;
export interface IRendererOptions {
    assets: bc.IAssetsIndex;
    path: string;
    publicPrefix: string;
}
export interface IRendererMultipleOutput {
    [file: string]: string;
}
export declare type RendererOutputRaw = string | IRendererMultipleOutput;
export declare type RendererOutput = RendererOutputRaw | Promise<RendererOutputRaw>;
export declare type Renderer = (options: IRendererOptions) => RendererOutput;
export declare function CompileAndGetDOM(entry: string, sourceCode: string): JSDOM;
export declare function renderPaths(paths: string[], wsr: Renderer, coreOptions: IRendererOptions, compilation: any): Promise<string[]>;
