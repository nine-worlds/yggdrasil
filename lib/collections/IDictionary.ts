import {IEnumerable} from "./IEnumerable";
import {KeyValuePair} from "./KeyValuePair";

export interface IDictionary<TKey, TValue> extends IEnumerable<KeyValuePair<TKey, TValue>> {
    add(key: TKey, value: TValue): void;

    remove(key: TKey): boolean;

    containsKey(key: TKey): boolean;

    containsValue(value: TValue): boolean;

    get(key: TKey): TValue | undefined;

    keys(): IEnumerable<TKey>;

    values(): IEnumerable<TValue>;

    entries(): IEnumerable<KeyValuePair<TKey, TValue>>;
}