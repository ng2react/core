import createAst from '../modules/parsing/create-ast'
import findComponentsInNode from '../modules/parsing/find-components-in-node'
import {AngularComponent} from '../model/AngularEntity'
import {getConverter} from '../modules/openai-conversion/main'
import {Ng2ReactConversionResult} from '../modules/openai-conversion/Ng2ReactConverter'
import * as fs from 'fs'

export {setLogLevel} from '../Logger'

/**
 * Find all components in a file.
 * @param absoluteFilePath
 */
export function search(absoluteFilePath: string): readonly AngularComponent[] {
    const fileContent = fs.readFileSync(absoluteFilePath, 'utf-8')
    const ast = createAst(absoluteFilePath, fileContent)
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
        const absoluteFilePath = absoluteFilePathOrComponent
        const components = search(absoluteFilePath)
        const component = components.find(c => c.name === componentName)
        if (!component) {
            throw Error(`Could not find component ${componentName} in ${absoluteFilePath}`)
        }
        return component
    })()

    const converter = getConverter()
    return converter.convert(component)
}
