import * as fs from 'fs'
import {getConverter, OpenAIOptions} from '../modules/openai-conversion/openai-converter'
import {search} from './main'
import {OPENAI_API_KEY, OPENAI_MODEL} from '../EnvVars'
import * as path from 'path'
import ConvertOptions from './ConvertOptions'

export function convert(fileContent: string, {file, componentName, ...config}: ConvertOptions) {
    const options = parseOptions(config, file)
    const components = search(fileContent, {file})
    const component = components.find(c => c.name === componentName)
    if (!component) {
        throw Error(`Could not find component ${componentName} in ${file}`)
    }
    const converter = getConverter(options)
    return converter.convert(component)
}

function parseOptions(options: Partial<OpenAIOptions>, absoluteFilePath: string) {
    return {
        apiKey: options.apiKey ?? OPENAI_API_KEY.value(),
        model: options.model ?? OPENAI_MODEL.value(),
        organization: options.organization || undefined,
        sourceRoot: options.sourceRoot ?? findNearestDirToPackageJson(absoluteFilePath),
        temperature: options.temperature ?? 0.2
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