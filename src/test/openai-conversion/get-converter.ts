import {getConverter} from '../../lib/modules/openai-conversion/openai-converter'
import fs from 'fs'
import path from 'path'
import {TEST_DATA_DIR} from '../test-data'
import type {AngularComponent} from '../../lib'


/// NOT A SPEC YET
const preparedComponent = fs.readFileSync(path.join(TEST_DATA_DIR, 'prepared-component.js'), 'utf-8')
// mock toStringComponent
jest.mock('../../lib/modules/openai-conversion/tostring-component', () => ({
    __esModule: true,
    default: () => preparedComponent
}))

// const model = 'gpt-4'
const model = 'text-davinci-003'
const converter = getConverter(model)

converter.convert({} as AngularComponent)
    .then((result) => result.forEach((r, i) =>
        fs.writeFileSync(path.resolve(__dirname, `result-${model}_${i}.js`), r, 'utf-8')
    ))
    .catch(err => {
        console.error(err.message)
    })