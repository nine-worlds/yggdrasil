import {EqualityComparerFunc} from "./EqualityComparerFunc";
import {deepEqual} from "./DeepEqual";

export function typeEqualityChecker<T>(): EqualityComparerFunc<T> {
    return (a, b) => deepEqual(a, b);
}
