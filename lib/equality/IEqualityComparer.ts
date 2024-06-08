export interface IEqualityComparer<T> {
    equals(a: T, b: T): boolean;
    getHashCode(item: T): number;
}

