import { getConverter } from '../../lib/modules/openai-conversion/openai-converter'
import fs from 'fs'
import path from 'path'
import { TEST_DATA_DIR } from '../test-data'
import { AngularComponent } from '../../lib/model/AngularEntity'
/// NOT A SPEC YET
const preparedComponent = fs.readFileSync(path.join(TEST_DATA_DIR, 'prepared-component.js'), 'utf-8')
// mock toStringComponent
// jest.mock('../../lib/modules/openai-conversion/gpt-prompt-builder', () => ({
//     __esModule: true,
//     buildGptMessage: () => [{role: 'user', content: 'TEST'}],
// }))

const model = 'gpt-4'
// const model = 'text-davinci-003'
const converter = getConverter({
    model,
    apiKey: process.env.OPENAI_API_KEY!,
    sourceRoot: undefined,
    customPrompt: undefined,
    targetLanguage: 'typescript',
    temperature: 0.5,
    organization: undefined,
})

converter
    .convert({} as AngularComponent)
    .then(({ results }) =>
        results.forEach(({ markdown, jsx }, i) =>
            fs.writeFileSync(path.resolve(__dirname, `result-${model}_${i}.js`), markdown, 'utf-8')
        )
    )
    .catch((err) => {
        console.error(err.message, err)
    })
