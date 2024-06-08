export type FuncSelector<TSource, TResult> = (source: TSource) => TResult;
export type IndexedFuncSelector<TSource, TResult> = (source: TSource, index: number) => TResult;