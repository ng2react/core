interface EnvVar {
    readonly key: string;

    value(): string

    readonly defaultValue?: string;
}

interface OptionalEnvVar {
    readonly key: string;

    value(): string | undefined;

    readonly defaultValue?: string;
}

export const OPENAI_API_KEY = {
    key: 'OPENAI_API_KEY',
    value
} as const satisfies EnvVar

export const OPENAI_MODEL = {
    key: 'OPENAI_MODEL',
    value,
    defaultValue: 'gpt-4'
} as const satisfies EnvVar

export const OPENAI_ORGANIZATION = {
    key: 'OPENAI_ORGANIZATION',
    value: optValue
} as const satisfies OptionalEnvVar

function value(this: EnvVar) {
    const value = optValue.call(this)
    if (value !== undefined) {
        return value
    }
    throw new Error(`Environment variable ${this.key} is required`)
}

function optValue(this: OptionalEnvVar) {
    return process.env[this.key] ?? this.defaultValue
}