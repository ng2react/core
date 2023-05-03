import {Configuration, OpenAIApi} from 'openai'
import Ng2ReactConverter, {Ng2ReactConversionResult} from './Ng2ReactConverter'
import type {AngularComponent} from '../../model/AngularEntity'
import {buildCompletionPrompt, buildGptMessage, processResponse} from './prompt-construction/gpt-prompt-builder'

export type OpenAIOptions = {
    readonly apiKey: string,
    readonly model: Completion | Gpt,
    readonly organization: string | undefined,
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

type Version = '1' | '2' | '3'
type Completion = `text-${'davinci' | 'curie' | 'babbage' | 'ada'}-00${Version}`
type Gpt = `gpt-${'3-turbo' | '4'}`

export function getConverter({apiKey, organization, model, sourceRoot, temperature}: OpenAIOptions): Ng2ReactConverter {
    const configuration = new Configuration({
        apiKey,
        organization
    })
    const openai = new OpenAIApi(configuration)
    if (isGpt(model)) {
        return gpt(model)
    } else if (isCompletion(model)) {
        return completion(model)
    }

    throw new Error(`No converter found for model ${model}`)

    function gpt(model: Gpt) {
        return {
            convert: async (component: AngularComponent) => {
                const response = await openai.createChatCompletion({
                    model,
                    messages: buildGptMessage(component, sourceRoot),
                    temperature
                })
                const results = response.data.choices
                    .map(c => c.message?.content)
                    .filter(m => m !== undefined) as string[]
                return results
                    .map(processResponse) satisfies Ng2ReactConversionResult[]
            }
        } satisfies Ng2ReactConverter
    }

    function completion(model: Completion) {
        return {
            convert: async (component: AngularComponent) => {
                const response = await openai.createCompletion({
                    model,
                    prompt: buildCompletionPrompt(component, sourceRoot),
                    temperature: 0,
                    max_tokens: 2048
                })
                const results = response.data.choices
                    .map(c => c.text)
                    .filter(text => text !== undefined) as string[]
                return results
                    .map(processResponse) satisfies Ng2ReactConversionResult[]
            }
        } satisfies Ng2ReactConverter
    }

    function isGpt(model: Completion | Gpt): model is Gpt {
        return model.startsWith('gpt-')
    }

    function isCompletion(model: Completion | Gpt): model is Completion {
        return model.startsWith('text-')
    }
}

