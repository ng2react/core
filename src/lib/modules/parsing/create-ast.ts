import {createSourceFile, ScriptTarget, type SourceFile} from 'typescript'
import * as fs from 'fs'

export default function createAst(filePath: string, fileContent: string): SourceFile {
    if (!fileContent) {
        fileContent = fs.readFileSync(filePath, 'utf-8')
    }
    return createSourceFile(filePath, fileContent, ScriptTarget.Latest, true)
}