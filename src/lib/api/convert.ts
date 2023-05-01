import {AngularComponent} from '../model/AngularEntity'
import {Ng2ReactConversionResult} from '../modules/openai-conversion/Ng2ReactConverter'
import * as fs from 'fs'
import {getConverter, OpenAIOptions} from '../modules/openai-conversion/openai-converter'
import {search} from './main'

/**
 * Convert a component to React. For use in javascript/typescript environments
 * where you have access to the component object returned by the search function.
 *
 * @see search
 */
export function convert(component: AngularComponent, config: OpenAIOptions): Promise<readonly Ng2ReactConversionResult[]>
/**
 * Convert a component to React. For use in CLI based environments where you only
 * have access to the absolute file path and component name.
 */
export function convert(absoluteFilePath: string, componentName: string, config: OpenAIOptions): Promise<readonly Ng2ReactConversionResult[]>
export function convert(absoluteFilePathOrComponent: string | AngularComponent,
                        componentNameOrConfig: string | OpenAIOptions,
                        optConfig?: OpenAIOptions) {
    const [component, config] = getComponentAndOptions()
    const converter = getConverter(config)
    return converter.convert(component)


    function getComponentAndOptions(): [AngularComponent, OpenAIOptions] {
        if (typeof absoluteFilePathOrComponent !== 'string') {
            return [absoluteFilePathOrComponent, parseOptions(componentNameOrConfig)]
        }

        assertComponentName(componentNameOrConfig)
        const filename = absoluteFilePathOrComponent
        const componentName = componentNameOrConfig
        const fileContent = fs.readFileSync(filename, 'utf-8')
        const components = search(fileContent, {filename})
        const component = components.find(c => c.name === componentName)
        if (!component) {
            throw Error(`Could not find component ${componentName} in ${filename}`)
        }
        return [component, parseOptions(optConfig)]

        function assertComponentName(s: unknown): asserts s is string {
            if (typeof s !== 'string') {
                throw Error(`Expected string, got ${s}`)
            }
        }

        function parseOptions(options: OpenAIOptions | string | undefined) {
            if (typeof options !== 'object' || options === null) {
                throw Error(`Expected object, got ${options}`)
            }
            return options
        }
    }
}
