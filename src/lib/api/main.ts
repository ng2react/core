import createAst from '../modules/parsing/create-ast'
import findComponentsInNode from '../modules/parsing/find-components-in-node'
import {AngularComponent} from '../model/AngularEntity'

export {setLogLevel} from '../Logger'

/**
 * Find all components in a file.
 */
export function search(fileContent: string, {filename = 'unknown.ts'} = {}): readonly AngularComponent[] {
    const ast = createAst(filename, fileContent)
    return findComponentsInNode(ast)
}

export {convert} from './convert'