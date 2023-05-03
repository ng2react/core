import {Configuration, OpenAIApi} from 'openai'
import Ng2ReactConverter, {Ng2ReactConversionResult} from './Ng2ReactConverter'
import type {AngularComponent} from '../../model/AngularEntity'
import {buildPrompt, processResponse} from './prompt-construction/gpt-prompt-builder'

export type OpenAIOptions = {
    readonly apiKey: string,
    readonly model: Completion | Gpt,
    readonly sourceRoot: string
    readonly organization: string | undefined
}

type Completion = `text-${'davinci' | 'curie' | 'babbage' | 'ada'}-${number}`
type Gpt = `gpt-${'3-turbo' | '4'}`

export function getConverter({apiKey, organization, model, sourceRoot}: OpenAIOptions): Ng2ReactConverter {
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
                    messages: [
                        {
                            role: 'user',
                            content: buildPrompt('component', component, sourceRoot)
                        }
                    ],
                    temperature: 0
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
                    prompt: buildPrompt('component', component, sourceRoot) + '\n\n React:\n\n', //'#AngularJS to React:\nAngularJS:\n' + toStringComponent(component) + '\nReact:\n',
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

