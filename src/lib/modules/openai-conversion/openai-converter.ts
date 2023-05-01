import {Configuration, OpenAIApi} from 'openai'
import Ng2ReactConverter, {Ng2ReactConversionResult} from './Ng2ReactConverter'
import type {AngularComponent} from '../../model/AngularEntity'
import toStringComponent from './tostring-component'
import {buildPrompt, extractJsx} from './gpt-prompt-builder'
import {OPENAI_API_KEY, OPENAI_MODEL} from '../../EnvVars'

export type OpenAIOptions = {
    readonly apiKey?: string,
    readonly model?: string,
    readonly organization?: string
}

export function getConverter({
                                 apiKey = OPENAI_API_KEY.value(),
                                 organization = OPENAI_API_KEY.value(),
                                 model = OPENAI_MODEL.value()
                             }: OpenAIOptions): Ng2ReactConverter {
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
                            content: buildPrompt('component', component)
                        }
                    ],
                    temperature: 0
                })
                const results = response.data.choices
                    .map(c => c.message?.content)
                    .filter(m => m !== undefined) as string[]
                return results
                    .map(markdown => ({
                        markdown,
                        jsx: extractJsx(markdown)
                    })) satisfies Ng2ReactConversionResult[]
            }
        } satisfies Ng2ReactConverter
    }

    function completion(model: string) {
        return {
            convert: async (component: AngularComponent) => {
                const response = await openai.createCompletion({
                    model,
                    prompt: '#AngularJS to React:\nAngularJS:\n' + toStringComponent(component) + '\nReact:\n',
                    temperature: 0,
                    max_tokens: 2048
                })
                const results = response.data.choices
                    .map(c => c.text)
                    .filter(text => text !== undefined) as string[]
                return results
                    .map(jsx => ({
                        jsx,
                        markdown: '```jsx\n' + jsx + '\n```'
                    })) satisfies Ng2ReactConversionResult[]
            }
        } satisfies Ng2ReactConverter
    }

}

