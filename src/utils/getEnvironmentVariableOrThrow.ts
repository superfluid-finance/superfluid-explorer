export function getEnvironmentVariableOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) throw Error(`Environment variable ${key} Value has to be defined.`);
    return value;
}
