import {Configuration, OpenAIApi} from 'openai'
import {OPEN_AI_MODEL, OPENAI_API_KEY} from '../../EnvVars'
import type Ng2ReactConverter from '../api/Ng2ReactConverter'
import type {AngularComponent} from '../../model/AngularEntity'
import toStringComponent from './tostring-component'

export function getConverter(model = OPEN_AI_MODEL.value(), utils = {toStringComponent}): Ng2ReactConverter {
    const configuration = new Configuration({
        apiKey: OPENAI_API_KEY.value()
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
                            content: 'Please provide a React rewrite of the following AngularJS component, and include any additional explanation as a header comment within the code:\n'
                                + utils.toStringComponent(component)
                        }
                    ],
                    temperature: 0
                })
                return response.data.choices
                    .map(c => c.message?.content)
                    .filter(m => m !== undefined) as string[]
            }
        } satisfies Ng2ReactConverter
    }

    function completion(model: string) {
        return {
            convert: async (component: AngularComponent) => {
                const response = await openai.createCompletion({
                    model,
                    prompt: '#AngularJS to React:\nAngularJS:\n' + utils.toStringComponent(component) + '\nReact:\n',
                    temperature: 0,
                    max_tokens: 2048
                })
                return response.data.choices
                    .map(c => c.text)
                    .filter(text => text !== undefined) as string[]
            }
        } satisfies Ng2ReactConverter
    }

}

