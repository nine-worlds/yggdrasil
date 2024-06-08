import {FuncBoolean} from "./FuncBoolean";
import {IEnumerable} from "./IEnumerable";

export interface IList<T> extends IEnumerable<T> {
    add(item: T): void

    addRange(items: Iterable<T>): void

    remove(predicate: FuncBoolean<T>): void

    clear(): void

    insert(index: number, item: T): void

    removeAt(index: number): void

    reverse(): void;

    replace(index: number, item: T): void;

    moveWithTypeEqualityChecker(element: T, toIndex: number): void;

    swapByElements(elementFrom: T, elementTo: T): void;

    swapByIndexes(index1: number, index2: number): void;
}