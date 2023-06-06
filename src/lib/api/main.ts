import createAst from '../modules/parsing/create-ast'
import findComponentsInNode from '../modules/parsing/find-components-in-node'
import { AngularComponent } from '../model/AngularEntity'
import { getConverter, OpenAIOptions } from '../modules/openai-conversion/openai-converter'
import { PROMPT_PATTERNS } from '../generated/prompt-template'
import { getReactTestGenerator, ReactTestOptions } from '../modules/openai-conversion/react-test-gen'
import testConnection, { ConnectionTestOptions } from '../modules/openai-conversion/test-connection'

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
 * Verify that the connection to OpenAI works.
 * @return The response from OpenAI: "This is a test!" (unless the AI is feeling salty)
 * @throws If the connection fails.
 */
export function checkConnection({
    apiKey,
    model = 'gpt-3-turbo',
}: {
    apiKey: string
    model?: ConnectionTestOptions['model']
}) {
    return testConnection({ apiKey, model })
}

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

export function generateReactTest(fileContent: string, config: ReactTestOptions) {
    const converter = getReactTestGenerator(config)
    return converter.generateTest(fileContent)
}

/**
 * Get the default prompt that is used to convert AngularJS components.
 */
export function getDefaultRules() {
    return PROMPT_PATTERNS
}
