import createAst from '../modules/parsing/create-ast'
import findComponentsInNode from '../modules/parsing/find-components-in-node'
import { AngularComponent } from '../model/AngularEntity'
import { getConverter, OpenAIOptions } from '../modules/openai-conversion/openai-converter'

export { setLogLevel } from '../Logger'

type NgComponentOptions = {
    /**
     * The absolute path to the file containing the component.
     */
    readonly file: string
    /**
     * The name of the component/directive to convert.
     */
    readonly componentName: string
}

export type ConvertOptions = NgComponentOptions & OpenAIOptions

/**
 * Find all components in a file.
 */
export function search(fileContent: string, { file = 'unknown.ts' } = {}): readonly AngularComponent[] {
    const ast = createAst(file, fileContent)
    return findComponentsInNode(ast)
}

export function convert(fileContent: string, { file, componentName, ...config }: ConvertOptions) {
    const components = search(fileContent, { file })
    const component = components.find((c) => c.name === componentName)
    if (!component) {
        throw Error(`Could not find component ${componentName} in ${file}`)
    }
    const converter = getConverter(config)
    return converter.convert(component)
}
