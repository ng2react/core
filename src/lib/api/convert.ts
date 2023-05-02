import {AngularComponent} from '../model/AngularEntity'
import {Ng2ReactConversionResult} from '../modules/openai-conversion/Ng2ReactConverter'
import * as fs from 'fs'
import {getConverter, OpenAIOptions} from '../modules/openai-conversion/openai-converter'
import {search} from './main'
import {OPENAI_API_KEY, OPENAI_MODEL, OPENAI_ORGANIZATION} from '../EnvVars'
import * as path from 'path'
import ConvertOptions from './ConvertOptions'

/**
 * Convert a component to React. For use in javascript/typescript environments
 * where you have access to the component object returned by the search function.
 *
 * @see search
 */
export function convert(component: AngularComponent, config: ConvertOptions): Promise<readonly Ng2ReactConversionResult[]>
/**
 * Convert a component to React. For use in CLI based environments where you only
 * have access to the absolute file path and component name.
 */
export function convert(absoluteFilePath: string, componentName: string, config: ConvertOptions): Promise<readonly Ng2ReactConversionResult[]>
export function convert(absoluteFilePathOrComponent: string | AngularComponent,
                        componentNameOrConfig: string | ConvertOptions,
                        optConfig?: ConvertOptions) {
    const [component, config] = getComponentAndOptions()
    const converter = getConverter(config)
    return converter.convert(component)


    function getComponentAndOptions(): [AngularComponent, OpenAIOptions] {
        if (typeof absoluteFilePathOrComponent !== 'string') {
            const filename = absoluteFilePathOrComponent.node.getSourceFile().fileName
            return [absoluteFilePathOrComponent, parseOptions(componentNameOrConfig, filename)]
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
        return [component, parseOptions(optConfig, filename)]

        function assertComponentName(s: unknown): asserts s is string {
            if (typeof s !== 'string') {
                throw Error(`Expected string, got ${s}`)
            }
        }
    }

}

function parseOptions(options: ConvertOptions | string | undefined, absoluteFilePath: string) {
    if (typeof options !== 'object' || options === null) {
        throw Error(`Expected object, got ${options}`)
    }
    return {
        apiKey: options.apiKey ?? OPENAI_API_KEY.value(),
        model: options.model ?? OPENAI_MODEL.value(),
        organization: options.organization ?? OPENAI_ORGANIZATION.value(),
        sourceRoot: options.sourceRoot ?? findNearestDirToPackageJson(absoluteFilePath)
    } satisfies OpenAIOptions
}

function findNearestDirToPackageJson(filename: string) {
    const parts = filename.split(path.sep)
    for (let i = parts.length - 1; i >= 0; i--) {
        const path = parts.slice(0, i).join('/')
        if (fs.existsSync(path + '/package.json')) {
            return `${path}/${parts[i + 1]}` // add the last part back
        }
    }
    throw Error(`Could not find package.json in ${filename} or any of its parent directories.` +
        ' Try explicitly setting the project root.')
}