export interface IAsset {
    chunkname: string;
    filename: string;
    [name: string]: any;
}
export interface IAssetsIndex {
    [name: string]: IAsset;
}
export interface ISourceCodeAndAssets {
    sourceCode: string;
    assets: IAssetsIndex;
}
export declare function BuildSourceCodeAndAssets(entry: string, attrs: string[], compilation: any): ISourceCodeAndAssets;
