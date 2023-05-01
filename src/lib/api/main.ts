import createAst from '../modules/parsing/create-ast'
import findComponentsInNode from '../modules/parsing/find-components-in-node'
import {AngularComponent} from '../model/AngularEntity'
import {getConverter} from '../modules/openai-conversion/main'
import {Ng2ReactConversionResult} from '../modules/openai-conversion/Ng2ReactConverter'
import * as fs from 'fs'

export {setLogLevel} from '../Logger'

/**
 * Find all components in a file.
 */
export function search(fileContent: string, {filename = 'unknown.ts'} = {}): readonly AngularComponent[] {
    const ast = createAst(filename, fileContent)
    return findComponentsInNode(ast)
}

/**
 * Convert a component to React. For use in javascript/typescript environments
 * where you have access to the component object returned by the search function.
 *
 * @see search
 */
export function convert(component: AngularComponent): Promise<readonly Ng2ReactConversionResult[]>
/**
 * Convert a component to React. For use in CLI based environments where you only
 * have access to the absolute file path and component name.
 */
export function convert(absoluteFilePath: string, componentName: string): Promise<readonly Ng2ReactConversionResult[]>
export function convert(absoluteFilePathOrComponent: string | AngularComponent, componentName?: string) {
    const component = (() => {
        if (typeof absoluteFilePathOrComponent !== 'string') {
            return absoluteFilePathOrComponent
        }
        const filename = absoluteFilePathOrComponent
        const fileContent = fs.readFileSync(filename, 'utf-8')
        const components = search(fileContent, {filename})
        const component = components.find(c => c.name === componentName)
        if (!component) {
            throw Error(`Could not find component ${componentName} in ${filename}`)
        }
        return component
    })()

    const converter = getConverter()
    return converter.convert(component)
}
