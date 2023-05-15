import { AngularComponent } from '../../../model/AngularEntity'
import findTemplate, { AngularTemplate } from './find-template'
import resolveTemplateUrl from './resolve-template-url'
import type { ChatCompletionRequestMessage } from 'openai'
import path from 'path'
import fs from 'fs'
import { TEMPLATE_DIR } from '../../../constants'

export const CODE_START = '// ___NG2R_START___'
export const CODE_END = '// ___NG2R_END___'

export const TPL_PATH = path.join(TEMPLATE_DIR, 'prompt-template.md')

export function buildGptMessage(component: AngularComponent, sourcesRoot: string | undefined) {
    const template = findTemplate(component)
    sourcesRoot ??= findNearestDirToPackageJson(component.node.getSourceFile().fileName)

    const promprtTemplate = fs.readFileSync(TPL_PATH, 'utf8')
    const [code, language] = buildCode('component', component, sourcesRoot, template)
    return [
        {
            role: 'user',
            content: promprtTemplate
                .replace('${LANGUAGE}', language)
                .replace('${COMPONENT}', code)
        }
    ] satisfies ChatCompletionRequestMessage[]
}

function buildCode(type: 'component', component: AngularComponent, sourcesRoot: string, template: AngularTemplate) {
    const language = component.node.getSourceFile().fileName.endsWith('.ts') ? 'Typescript' : 'JavaScript'
    const componentPrompt = [
        'Here is the AngularJS component:',
        `\`\`\`${language.toLowerCase()}`,
        component.node.getText(),
        '```'
    ]

    if (template.resolution === 'inline') {
        return [componentPrompt.join('\n'), language] as const
    }

    const html = resolveTemplateUrl({
        sourcesRoot,
        filePath: component.node.getSourceFile().fileName,
        templateUrl: template.path
    })

    componentPrompt.push('',
        'Here is the html template:',
        '```html',
        html,
        '```'
    )

    return [componentPrompt.join('\n'), language] as const
}

export function buildCompletionPrompt(component: AngularComponent, sourcesRoot: string | undefined): string {
    return `#AngularJS to React:\nAngularJS:\n${component.node.getText()}\nReact:\n`
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