import {IEqualityComparer} from "../equality";
import {FuncBoolean, IndexedFuncBoolean} from "./FuncBoolean";
import {FuncSelector, IndexedFuncSelector} from "./FuncSelector";
import {FuncAccumulate} from "./FuncAccumulate";
import {IList} from "./IList";
import {IDictionary} from "./IDictionary";
import {KeyValuePair} from "./KeyValuePair";

export interface IEnumerable<T> {
    readonly length: () => number

    [Symbol.iterator](): Iterator<T>;

    all(predicate: FuncBoolean<T>): boolean;

    any(predicate?: FuncBoolean<T>): boolean;

    where(predicate: IndexedFuncBoolean<T>): IEnumerable<T>

    aggregate(func: FuncAccumulate<T, T, T>, initialValue?: T): T;

    containsWithPredicates(element: T, ...predicate: FuncSelector<T, any>[]): boolean;

    containsWithTypeEqualityChecker(element: T): boolean;

    containsWithEqualityComparer(element: T, equalityComparer: IEqualityComparer<T>): boolean;

    elementAtIndex(index: number): T;

    sort(comparer?: (a: T, b: T) => number): IEnumerable<T>

    zip<TOther, TResult>(other: Iterable<TOther>, selector: (item: T, other: TOther) => TResult): IEnumerable<TResult>

    order<TKey>(keySelector: FuncSelector<T, TKey>): IEnumerable<T>

    orderBy<TKey>(keySelector: FuncSelector<T, TKey>): IEnumerable<T>

    orderByDescending<TKey>(keySelector: FuncSelector<T, TKey>): IEnumerable<T>

    take(count: number): IEnumerable<T>;

    skip(count: number): IEnumerable<T>;

    takeWhile(predicate: FuncBoolean<T>): IEnumerable<T>

    skipWhile(predicate: FuncBoolean<T>): IEnumerable<T>

    union(other: Iterable<T>): IEnumerable<T>

    unionBy<TKey>(other: Iterable<T>, keySelector: FuncSelector<T, TKey>): IEnumerable<T>

    distinctBy(...keySelectors: FuncSelector<T, any>[]): IEnumerable<T>;

    exceptBy<TKey>(other: Iterable<T>, keySelector: FuncSelector<T, TKey>): IEnumerable<T>;

    first(predicate?: FuncBoolean<T>): T;

    firstOrDefault(predicate?: FuncBoolean<T>): T | undefined;

    last(predicate?: FuncBoolean<T>): T;

    lastOrDefault(predicate?: FuncBoolean<T>): T | undefined;

    groupBy<TKey>(keySelector: IndexedFuncSelector<T, TKey>): IEnumerable<Map<TKey, T[]>>;

    min(selector?: FuncSelector<T, number>): T | undefined;

    max(selector?: FuncSelector<T, number>): T | undefined;

    average(selector?: FuncSelector<T, number>): number | undefined;

    chunk(size: number): IEnumerable<T[]>;

    append(value: T): IEnumerable<T>;

    appendMany(value: IEnumerable<T> | T[]): IEnumerable<T>;

    select<TResult>(selector: IndexedFuncSelector<T, TResult>): IEnumerable<TResult>;

    selectMany<TResult>(selector: IndexedFuncSelector<T, Iterable<TResult>>): IEnumerable<TResult>;

    toArray(): T[]

    toList(): IList<T>

    toDictionary<TKey, TValue>(selector: IndexedFuncSelector<T, KeyValuePair<TKey, TValue>>): IDictionary<TKey, TValue>
}
