import { isGpt, OpenAIOptions } from './openai-converter'
import { Configuration, OpenAIApi } from 'openai'

export type ConnectionTestOptions = Pick<OpenAIOptions, 'apiKey' | 'model'>

export default async function testConnection({ apiKey, model }: ConnectionTestOptions) {
    if (!apiKey) {
        throw new Error('No API key provided')
    }
    if (!isGpt(model)) {
        throw new Error(`OpenAI model not supported: ${model}`)
    }
    const configuration = new Configuration({
        apiKey,
    })
    const openai = new OpenAIApi(configuration)

    const response = await openai.createChatCompletion({
        model,
        messages: [
            {
                role: 'user',
                content: 'Say this is a test!',
            },
        ],
    })
    const results = response.data.choices.map((c) => c.message?.content).filter((m) => m !== undefined) as string[]
    return results.join('')
}
