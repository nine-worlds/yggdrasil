import {IEqualityComparer} from "./IEqualityComparer";

export function EqualityComparer<T>(equals: (a: T, b: T) => boolean, getHashCode: (item: T) => number): IEqualityComparer<T> {
    return {
        equals,
        getHashCode
    };
}