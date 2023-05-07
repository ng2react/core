import * as path from 'path'
import * as fs from 'fs'

export const TEST_DATA_DIR = path.resolve(__dirname, 'test_data')

export class MultipleComponents {
    static readonly path = path.resolve(__dirname, 'test_data/components.js')
    static readonly content = fs.readFileSync(MultipleComponents.path, 'utf-8')
    static readonly componentsCount = MultipleComponents.content.match(/\.component\(/g)?.length ?? -1
}

export class TodoList {
    static readonly path = path.resolve(__dirname, 'test_data/todo-list.js')
}
