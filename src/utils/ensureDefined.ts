export function ensureDefined<T>(value: T | undefined): T {
    if (!value) throw Error('Value has to be defined.');
    return value;
}
