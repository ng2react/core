import fs from 'fs'
import { it } from 'mocha'
import path from 'path'
import parseFile from '../lib/parse-file.mts'

const TODO_COMPONENT = path.resolve(__dirname, '../../angularjs-examples/todo/src/todo-list/todo-list.component.js');

it('Test stuff', () => {
    const content = fs.readFileSync(TODO_COMPONENT, 'utf-8')
    console.log(content)
    parseFile(content)
})