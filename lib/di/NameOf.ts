export function nameOfProperty<T>(property: keyof T): keyof T {
    return property
}

export function nameOf(type: Function): string {
    return type.name;
}

export function nameOfWithDelimiter(delimiter?: string, ...type: Function[]): string {
    return type.map(selectNameProperty).join(delimiter);
}

const selectNameProperty = (type: Function) => type.name;

