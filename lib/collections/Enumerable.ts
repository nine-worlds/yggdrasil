import {IEqualityComparer, typeEqualityChecker, EqualityComparerFunc} from "../equality";
import {IEnumerable} from "./IEnumerable";
import {FuncBoolean, IndexedFuncBoolean} from "./FuncBoolean";
import {FuncSelector, IndexedFuncSelector} from "./FuncSelector";
import {FuncAccumulate} from "./FuncAccumulate";
import {KeyValuePair} from "./KeyValuePair";
import {IDictionary} from "./IDictionary";
import {IList} from "./IList";

export class Enumerable<T> implements IEnumerable<T> {
    private readonly items: T[];
    protected readonly _typeEqualityChecker: EqualityComparerFunc<T>;

    public readonly length: () => number = () => this.getLength();

    constructor(items: T[] | IEnumerable<T> | undefined) {
        this.items = Array.isArray(items) ? items : [];
        this._typeEqualityChecker = typeEqualityChecker<T>();
    }

    * [Symbol.iterator]() {
        for (let i = 0; i < this.items.length; i++) {
            yield this.items[i];
        }
    }

    all(predicate: FuncBoolean<T>): boolean {
        return this.items.every(predicate);
    }

    any(predicate?: FuncBoolean<T>): boolean {
        if (predicate) {
            return this.items.some(predicate);
        }
        return this.items.length > 0;
    }

    where(predicate: IndexedFuncBoolean<T>): IEnumerable<T> {
        const filteredItems = this.items.filter((item, index) => predicate(item, index));
        return new Enumerable(filteredItems);
    }

    aggregate(func: FuncAccumulate<T, T, T>, initialValue?: T): T {
        if (this.items.length === 0) {
            throw new Error('Sequence contains no elements.');
        }

        let accumulator: T;
        let startIndex: number;

        if (initialValue !== undefined) {
            accumulator = initialValue;
            startIndex = 0;
        } else {
            accumulator = this.items[0] as unknown as T;
            startIndex = 1;
        }

        for (let i = startIndex; i < this.items.length; i++) {
            accumulator = func(accumulator, this.items[i] as unknown as T, i);
        }

        return accumulator;
    }

    containsWithPredicates<_TKey>(element: T, ...predicates: FuncSelector<T, any>[]): boolean {
        return this.items.some((item) => {
            return predicates.every(predicate => predicate(element) === predicate(item));
        });
    }

    containsWithTypeEqualityChecker(element: T): boolean {
        return this.items.some(item => this._typeEqualityChecker(element, item))
    }

    containsWithEqualityComparer(element: T, equalityComparer: IEqualityComparer<T>): boolean {
        return this.items.some(item => equalityComparer.equals(element, item))
    }

    elementAtIndex(index: number): T {
        return this.items[index];
    }

    sort(comparer?: (a: T, b: T) => number): IEnumerable<T> {
        const sortedItems = this.items.slice().sort(comparer);
        return new Enumerable(sortedItems);
    }

    zip<TOther, TResult>(other: Iterable<TOther>, selector: (item: T, other: TOther) => TResult): IEnumerable<TResult> {
        const otherIterator = other[Symbol.iterator]();
        const zippedItems = this.items.map((item) => {
            const {value, done} = otherIterator.next();
            return done ? undefined : selector(item, value);
        }) as TResult[]; // Type assertion to ensure the resulting array type
        return new Enumerable(zippedItems);
    }

    order<TKey>(keySelector: FuncSelector<T, TKey>): IEnumerable<T> {
        return this.sort((a, b) => {
            const keyA = keySelector(a);
            const keyB = keySelector(b);
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });
    }

    orderBy<TKey>(keySelector: FuncSelector<T, TKey>): IEnumerable<T> {
        return this.order(keySelector);
    }

    orderByDescending<TKey>(keySelector: FuncSelector<T, TKey>): IEnumerable<T> {
        return this.sort((a, b) => {
            const keyA = keySelector(a);
            const keyB = keySelector(b);
            if (keyA > keyB) return -1;
            if (keyA < keyB) return 1;
            return 0;
        });
    }

    take(count: number): IEnumerable<T> {
        return new Enumerable(this.items.slice(0, count));
    }

    skip(count: number): IEnumerable<T> {
        return new Enumerable(this.items.slice(count));
    }

    takeWhile(predicate: FuncBoolean<T>): IEnumerable<T> {
        const takenItems: T[] = [];
        for (const item of this.items) {
            if (predicate(item)) {
                takenItems.push(item);
            } else {
                break;
            }
        }
        return new Enumerable(takenItems);
    }

    skipWhile(predicate: FuncBoolean<T>): IEnumerable<T> {
        let startIndex = 0;
        while (startIndex < this.items.length && predicate(this.items[startIndex])) {
            startIndex++;
        }
        return new Enumerable(this.items.slice(startIndex));
    }

    union(other: Iterable<T>): IEnumerable<T> {
        const unionSet = new Set(this.items);
        for (const item of other) {
            unionSet.add(item);
        }
        return new Enumerable(Array.from(unionSet));
    }

    unionBy<TKey>(other: Iterable<T>, keySelector: FuncSelector<T, TKey>): IEnumerable<T> {
        const unionSet = new Set(this.items.map(keySelector));
        for (const item of other) {
            const key = keySelector(item);
            if (!unionSet.has(key)) {
                unionSet.add(key);
                this.items.push(item);
            }
        }
        return new Enumerable(this.items);
    }

    distinctBy<TKey>(...keySelectors: FuncSelector<T, TKey>[]): IEnumerable<T> {
        const distinctItems = new Map<TKey, T>();

        for (const item of this.items) {
            for (let keySelector of keySelectors) {
                const key = keySelector(item);
                if (!distinctItems.has(key)) {
                    distinctItems.set(key, item);
                }
            }
        }

        return new Enumerable(Array.from(distinctItems.values()));
    }

    exceptBy<TKey>(other: Iterable<T>, keySelector: FuncSelector<T, TKey>): IEnumerable<T> {
        const otherItems = Array.from(other);
        return new Enumerable(this.items.filter((item) => {
            const key = keySelector(item);
            return !otherItems.some((otherItem, _index) => keySelector(otherItem) === key);
        }));
    }

    first(predicate?: FuncBoolean<T>): T {
        return this.firstOrDefault(predicate) ?? {} as T
    }

    firstOrDefault(predicate?: FuncBoolean<T>): T | undefined {
        if (predicate) {
            return this.items.find(predicate);
        }

        return this.items.length > 0 ? this.items[0] : undefined;
    }

    last(predicate?: FuncBoolean<T>): T {
        return this.lastOrDefault(predicate) ?? {} as T
    }

    lastOrDefault(predicate?: FuncBoolean<T>): T | undefined {
        if (predicate) {
            const reversedItems = this.items.slice().reverse();
            return reversedItems.find(predicate);
        }

        return this.items.length > 0 ? this.items[this.items.length - 1] : undefined;
    }

    groupBy<TKey>(keySelector: IndexedFuncSelector<T, TKey>): IEnumerable<Map<TKey, T[]>> {
        const groups = new Map<TKey, T[]>();

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const key = keySelector(item, i);
            if (!groups.has(key)) {
                groups.set(key, []);
            }
            groups.get(key)?.push(item);
        }

        const groupMaps: Map<TKey, T[]>[] = [];
        groups.forEach((value, key) => {
            const groupMap = new Map<TKey, T[]>();
            groupMap.set(key, value);
            groupMaps.push(groupMap);
        });

        return new Enumerable(groupMaps);
    }

    min(selector?: FuncSelector<T, number>): T | undefined {
        if (!this.items.length) {
            return undefined;
        }

        if (selector) {
            return this.items.reduce((minItem, currentItem) =>
                selector(currentItem) < selector(minItem) ? currentItem : minItem
            );
        }

        return this.items.reduce((minItem, currentItem) =>
            currentItem < minItem ? currentItem : minItem
        );
    }

    max(selector?: FuncSelector<T, number>): T | undefined {
        if (!this.items.length) {
            return undefined;
        }

        if (selector) {
            return this.items.reduce((maxItem, currentItem) =>
                selector(currentItem) > selector(maxItem) ? currentItem : maxItem
            );
        }

        return this.items.reduce((maxItem, currentItem) =>
            currentItem > maxItem ? currentItem : maxItem
        );
    }

    average(selector?: FuncSelector<T, number>): number | undefined {
        if (!this.items.length) {
            return undefined;
        }

        if (selector) {
            const sum = this.items.reduce((acc, curr) => acc + selector(curr), 0);
            return sum / this.items.length;
        }

        const sum = this.items.reduce((acc, curr) => acc + Number(curr), 0);
        return sum / this.items.length;
    }

    chunk(size: number): IEnumerable<T[]> {
        const chunks: T[][] = [];

        for (let i = 0; i < this.items.length; i += size) {
            const chunk = this.items.slice(i, i + size);
            chunks.push(chunk);
        }

        return new Enumerable(chunks);
    }

    append(value: T): IEnumerable<T> {
        return new Enumerable([...this.items, value]);
    }

    appendMany(value: IEnumerable<T> | T[]): IEnumerable<T> {
        return new Enumerable([...this.items, ...value]);
    }

    select<TResult>(selector: IndexedFuncSelector<T, TResult>): IEnumerable<TResult> {
        const selectedItems = this.items.map(selector);
        return new Enumerable(selectedItems);
    }

    selectMany<TResult>(selector: IndexedFuncSelector<T, Iterable<TResult>>): IEnumerable<TResult> {
        const selectedItems: TResult[] = [];

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const results = selector(item, i);
            for (const result of results) {
                selectedItems.push(result);
            }
        }

        return new Enumerable(selectedItems);
    }

    toArray(): T[] {
        return this.items;
    }

    toList(): IList<T> {
        return new List(this)
    }

    toDictionary<TKey, TValue>(selector: IndexedFuncSelector<T, KeyValuePair<TKey, TValue>>): IDictionary<TKey, TValue> {
        const valuePairs: KeyValuePair<TKey, TValue>[] = []
        for (let index = 0; index < this.length(); index++) {
            const element = this.elementAtIndex(index);
            const selectedValuePair = selector(element, index);
            valuePairs.push(selectedValuePair);
        }

        return new Dictionary(valuePairs)
    }

    static asEnumerable<TResult>(from: TResult[] | undefined): IEnumerable<TResult> {
        return new Enumerable(from);
    }

    static readonly empty = new Enumerable([]) as IEnumerable<never>;
    static readonly emptyAs = <TResult>() => new Enumerable<TResult>([]) as IEnumerable<TResult>;

    private getLength() {
        if (!this.items) return 0;
        return this.items.length;
    }
}

export class List<T> extends Enumerable<T> implements IList<T> {
    private materializedItems: T[];

    constructor(items: T[] | IEnumerable<T>) {
        if (items instanceof Enumerable) {
            super(items.toArray());
            this.materializedItems = items.toArray();
        } else if (Array.isArray(items)) {
            super(items);
            this.materializedItems = items;
        } else {
            super([])
            this.materializedItems = []
        }
    }

    * [Symbol.iterator]() {
        for (let i = 0; i < this.materializedItems.length; i++) {
            yield this.materializedItems[i];
        }
    }

    // Override methods to mutate the materialized content
    add(item: T): void {
        this.materializedItems.push(item);
    }

    addRange(items: Iterable<T>): void {
        for (const item of items) {
            this.add(item);
        }
    }

    remove(predicate: FuncBoolean<T>): void {
        this.materializedItems = this.materializedItems.filter((item) => !predicate(item));
    }

    clear(): void {
        this.materializedItems = [];
    }

    insert(index: number, item: T): void {
        this.materializedItems.splice(index, 0, item);
    }

    removeAt(index: number): void {
        this.materializedItems.splice(index, 1);
    }

    reverse(): void {
        this.materializedItems.reverse()
    }

    replace(index: number, item: T): void {
        if (index >= 0 && index < this.materializedItems.length) {
            this.materializedItems[index] = item;
        }
    }

    moveWithTypeEqualityChecker(element: T, toIndex: number): void {
        const index = this.materializedItems.findIndex(value => this._typeEqualityChecker(value, element));

        if (index === -1) throw new Error('Element not found.');

        const item = this.materializedItems[index];
        this.materializedItems.splice(index, 1);
        this.materializedItems.splice(toIndex, 0, item);
    }

    swapByElements(elementFrom: T, elementTo: T): void {
        const index1 = this.materializedItems.findIndex(value => this._typeEqualityChecker(value, elementFrom));
        const index2 = this.materializedItems.findIndex(value => this._typeEqualityChecker(value, elementTo));

        if (index1 === -1 || index2 === -1) {
            throw new Error('Element not found.');
        }

        this.swapByIndexes(index1, index2);
    }

    swapByIndexes(index1: number, index2: number): void {
        if (index1 < 0 || index1 >= this.materializedItems.length || index2 < 0 || index2 >= this.materializedItems.length) {
            throw new Error('Invalid index.');
        }

        const temp = this.materializedItems[index1];
        this.materializedItems[index1] = this.materializedItems[index2];
        this.materializedItems[index2] = temp;
    }

    toArray(): T[] {
        return this.materializedItems.slice();
    }

    toList(): List<T> {
        return new List(this.materializedItems);
    }
}

export class Dictionary<TKey, TValue> extends Enumerable<KeyValuePair<TKey, TValue>> implements IDictionary<TKey, TValue> {
    private readonly materializedItems: KeyValuePair<TKey, TValue>[];

    constructor(items: KeyValuePair<TKey, TValue>[] | IEnumerable<KeyValuePair<TKey, TValue>>) {
        if (items instanceof Enumerable) {
            super(items.toArray());
            this.materializedItems = items.toArray();
        } else if (Array.isArray(items)) {
            super(items);
            this.materializedItems = items;
        } else {
            super([])
            this.materializedItems = []
        }
    }

    add(key: TKey, value: TValue): void {
        this.materializedItems.push({key: key, value: value});
    }

    remove(key: TKey): boolean {
        const index = this.materializedItems.findIndex((vP) => vP.key === key);
        if (index !== -1) {
            this.materializedItems.splice(index, 1);
            return true;
        }
        return false;
    }

    containsKey(key: TKey): boolean {
        return this.materializedItems.some((vP) => vP.key === key);
    }

    containsValue(value: TValue): boolean {
        return this.materializedItems.some((vP) => vP.value === value);
    }

    get(key: TKey): TValue | undefined {
        const entry = this.materializedItems.find((vP) => vP.key === key);
        return entry ? entry.value : undefined;
    }

    elementAtIndex(index: number): KeyValuePair<TKey, TValue> {
        return this.materializedItems[index];
    }

    keys(): IEnumerable<TKey> {
        return new Enumerable(this.materializedItems.map(({key}) => key));
    }

    values(): IEnumerable<TValue> {
        return new Enumerable(this.materializedItems.map(({value}) => value));
    }

    entries(): IEnumerable<KeyValuePair<TKey, TValue>> {
        return new Enumerable(this.materializedItems);
    }

    static readonly emptyDictionary = <TKey, TValue>() => new Dictionary<TKey, TValue>([]);
}
