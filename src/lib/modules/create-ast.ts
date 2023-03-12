import {createSourceFile, ScriptTarget, type SourceFile} from 'typescript'
import fs from 'fs'

export default function createAst(filePath: string): SourceFile
export default function createAst(filePath: string, fileContent: string): SourceFile
export default function createAst(filePath: string, fileContent?: string): SourceFile {
    if (!fileContent) {
        fileContent = fs.readFileSync(filePath, 'utf-8')
    }
    const source = createSourceFile(filePath, fileContent, ScriptTarget.Latest, true)
    return source
}