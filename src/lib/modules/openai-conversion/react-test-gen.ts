import { isGpt, OpenAIOptions } from './openai-converter'
import { Ng2ReactConversionResult, ReactTestGenerator } from './Ng2ReactConverter'
import { REACT_TEST_PROMPT } from '../../generated/prompt-template'
import processResponse from './process-response'
import { Configuration, OpenAIApi } from 'openai'

export type ReactTestOptions = Omit<OpenAIOptions, 'sourceRoot' | 'customPrompt'>

export function getReactTestGenerator({
    apiKey,
    organization,
    model,
    temperature,
    targetLanguage,
}: ReactTestOptions): ReactTestGenerator {
    const configuration = new Configuration({
        apiKey,
        organization,
    })
    const openai = new OpenAIApi(configuration)
    if (isGpt(model)) {
        return gpt(model)
    }

    throw new Error(`No converter found for model ${model}`)

    function gpt(model: string) {
        return {
            generateTest: async (reactFileContent: string) => {
                const prompt = [
                    REACT_TEST_PROMPT.replace('${LANGUAGE}', targetLanguage ?? 'the same as the source language'),
                    '',
                    '**The React Component:**',
                    '```',
                    reactFileContent,
                    '```',
                ].join('\n')
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
        }
    }
}
