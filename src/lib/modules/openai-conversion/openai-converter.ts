import {Configuration, OpenAIApi} from 'openai'
import Ng2ReactConverter, {Ng2ReactConversionResult} from './Ng2ReactConverter'
import type {AngularComponent} from '../../model/AngularEntity'
import {buildPrompt, processResponse} from './prompt-construction/gpt-prompt-builder'

export type OpenAIOptions = {
    readonly apiKey: string,
    readonly model: string,
    readonly sourceRoot: string
    readonly organization?: string
}

export function getConverter({apiKey, organization, model, sourceRoot}: OpenAIOptions): Ng2ReactConverter {
    const configuration = new Configuration({
        apiKey,
        organization
    })
    const openai = new OpenAIApi(configuration)
    if (model.includes('gpt-4')) {
        return Gpt4(model)
    } else if (model.includes('text-')) {
        return completion(model)
    }

    throw new Error(`No converter found for model ${model}`)

    function Gpt4(model: string) {
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

    function completion(model: string) {
        return {
            convert: async (component: AngularComponent) => {
                const response = await openai.createCompletion({
                    model,
                    prompt: buildPrompt('component', component, sourceRoot), //'#AngularJS to React:\nAngularJS:\n' + toStringComponent(component) + '\nReact:\n',
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

}

