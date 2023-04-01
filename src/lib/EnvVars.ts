interface EnvVar {
    readonly key: string;

    value(): string;

    readonly defaultValue?: string;
}

export const OPENAI_API_KEY = {
    key: 'OPENAI_API_KEY',
    value
} as const satisfies EnvVar

export const OPEN_AI_MODEL = {
    key: 'OPEN_AI_MODEL',
    value,
    defaultValue: 'gpt-4'
} as const satisfies EnvVar


function value(this: EnvVar) {
    const value = process.env[this.key]
    if (value !== undefined) {
        return value
    }
    if (this.defaultValue !== undefined) {
        return this.defaultValue
    }
    throw new Error(`Environment variable ${this.key} is required`)

}