import { Configuration, OpenAIApi } from 'openai'
import Ng2ReactConverter, { Ng2ReactConversionResult } from './Ng2ReactConverter'
import type { AngularComponent } from '../../model/AngularEntity'
import { buildGptMessage } from './prompt-construction/gpt-prompt-builder'
import processResponse from './process-response'

export type OpenAIOptions = {
    readonly apiKey: string
    readonly model: Gpt
    readonly organization: string | undefined
    /**
     * The temperature to use when generating completions. Higher values result in more random completions.
     * Must be between 0 and 2.
     */
    readonly temperature: number | undefined
    /**
     * The root directory of the project. If not specified, the directory below that of the
     * nearest package.json file will be used.
     */
    readonly sourceRoot: string | undefined
}

// type Version = '1' | '2' | '3'
// type Completion = `text-${'davinci' | 'curie' | 'babbage' | 'ada'}-00${Version}`
type Gpt = `gpt-${'3-turbo' | '4'}`

export function getConverter({
    apiKey,
    organization,
    model,
    sourceRoot,
    temperature,
}: OpenAIOptions): Ng2ReactConverter {
    const configuration = new Configuration({
        apiKey,
        organization,
    })
    const openai = new OpenAIApi(configuration)
    if (isGpt(model)) {
        return gpt(model)
    }

    throw new Error(`No converter found for model ${model}`)

    function gpt(model: Gpt) {
        return {
            convert: async (component: AngularComponent) => {
                const { prompt } = buildGptMessage(component, sourceRoot)
                const response = await openai.createChatCompletion({
                    model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    temperature,
                })
                const results = response.data.choices
                    .map((c) => c.message?.content)
                    .filter((m) => m !== undefined) as string[]
                return {
                    prompt,
                    results: results.map(processResponse),
                } satisfies Ng2ReactConversionResult
            },
        } satisfies Ng2ReactConverter
    }

    function isGpt(model: Gpt): model is Gpt {
        return model.startsWith('gpt-')
    }
}
