import { AngularComponent } from '../../../model/AngularEntity'
import findTemplate, { AngularTemplate } from './find-template'
import resolveTemplateUrl from './resolve-template-url'
import type { ChatCompletionRequestMessage } from 'openai'
import path from 'path'
import fs from 'fs'

export const CODE_START = '// ___NG2R_START___'
export const CODE_END = '// ___NG2R_STOP___'

export function buildGptMessage(component: AngularComponent, sourcesRoot: string | undefined) {
    const template = findTemplate(component)
    sourcesRoot ??= findNearestDirToPackageJson(component.node.getSourceFile().fileName)
    return [
        {
            role: 'user',
            content: buildRules({
                isTs: component.node.getSourceFile().fileName.endsWith('.ts')
            })
        },
        ...buildCode('component', component, sourcesRoot, template)
    ] satisfies ChatCompletionRequestMessage[]
}

function buildCode(type: 'component', component: AngularComponent, sourcesRoot: string, template: AngularTemplate) {
    const componentPrompt = [
        'Here is the AngularJS component:',
        '```ts',
        component.node.getText(),
        '```'
    ].join('\n')

    if (template.resolution === 'inline') {
        return [{
            role: 'user',
            content: componentPrompt
        }] satisfies ChatCompletionRequestMessage[]
    }

    const html = resolveTemplateUrl({
        sourcesRoot,
        filePath: component.node.getSourceFile().fileName,
        templateUrl: template.path
    })

    const templatePrompt = [
        'Here is the html template:',
        '```html',
        html,
        '```'
    ].join('\n')

    return [
        {
            role: 'user',
            content: componentPrompt
        },
        {
            role: 'user',
            content: templatePrompt
        }
    ] satisfies ChatCompletionRequestMessage[]
}

function buildRules({ isTs }: { isTs: boolean }) {
    const promptLines = [
        'Please convert the following AngularJS component to a functional React element.',
        ' * You should explain any assumptions you have made and highlight any potential issues.',
        ` * So that I can programmatically find your code, please top and tail it with "${CODE_START}" and "${CODE_END}"`,
    ]
    if (isTs) {
        promptLines.push(' * Please use TypeScript')
    }
    return promptLines.join('\n')
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