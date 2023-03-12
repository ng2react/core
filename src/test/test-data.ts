import path from 'path'
import fs from 'fs'

export class MultipleComponents {
    static readonly path = path.resolve(__dirname, 'test_data/components.js')
    static readonly content = fs.readFileSync(MultipleComponents.path, 'utf-8')
    static readonly componentsCount = MultipleComponents.content.match(/\.component\(/g)?.length ?? -1
}