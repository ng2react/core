import { AngularComponent } from '../../../model/AngularEntity'
import findTemplate, { AngularTemplate } from './find-template'
import resolveTemplateUrl from './resolve-template-url'
import type { ChatCompletionRequestMessage } from 'openai'
import path from 'path'
import fs from 'fs'
import PROMPT_TEMPLATE from '../../../generated/prompt-template'
import findController, { ComponentController } from './find-controller'

export const CODE_START = '// ___NG2R_START___'
export const CODE_END = '// ___NG2R_END___'

export function buildGptMessage(component: AngularComponent, sourcesRoot: string | undefined) {
    const template = findTemplate(component)
    const controller = findController(component)

    sourcesRoot ??= findNearestDirToPackageJson(component.node.getSourceFile().fileName)

    const [code, language] = buildCode('component', component, sourcesRoot, template, controller)

    const prompt = PROMPT_TEMPLATE.replace('${LANGUAGE}', language).replace('${COMPONENT}', code)

    return [
        {
            role: 'user',
            content: prompt,
        },
    ] satisfies ChatCompletionRequestMessage[]
}

function buildCode(
    type: 'component',
    component: AngularComponent,
    sourcesRoot: string,
    template: AngularTemplate,
    controller: ComponentController
) {
    const language = component.node.getSourceFile().fileName.endsWith('.ts') ? 'Typescript' : 'JavaScript'
    const componentPrompt = [
        'Here is the AngularJS component:',
        `\`\`\`${language.toLowerCase()}`,
        component.node.getText(),
        '```',
    ]

    if (controller.resolution === 'node') {
        const controllerCode = controller.node.getText()
        componentPrompt.push('', 'Here is the controller:', '```js', controllerCode, '```', '')
    }

    if (template.resolution !== 'inline') {
        const html = resolveTemplateUrl({
            sourcesRoot,
            filePath: component.node.getSourceFile().fileName,
            templateUrl: template.path,
        })

        componentPrompt.push('', 'Here is the html template:', '```html', html, '```')
    }

    return [componentPrompt.join('\n'), language] as const
}

export function buildCompletionPrompt(component: AngularComponent, sourcesRoot: string | undefined): string {
    return `#AngularJS to React:\nAngularJS:\n${component.node.getText()}\nReact:\n`
}

function findNearestDirToPackageJson(filename: string) {
    const parts = filename.split(path.sep)
    for (let i = parts.length - 1; i >= 0; i--) {
        const currentPath = parts.slice(0, i).join(path.sep)
        if (fs.existsSync(path.join(currentPath, 'package.json'))) {
            return path.join(currentPath, parts[i]) // add the last part back
        }
    }
    throw Error(
        `Could not find package.json in ${filename} or any of its parent directories.` +
            ' Try explicitly setting the project root.'
    )
}
