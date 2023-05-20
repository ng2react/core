import { AngularComponent } from '../../../model/AngularEntity'
import findTemplate, { AngularTemplate } from './find-template'
import resolveTemplateUrl from './resolve-template-url'
import path from 'path'
import fs from 'fs'
import PROMPT_TEMPLATE from '../../../generated/prompt-template'

export function buildGptMessage(component: AngularComponent, sourcesRoot: string | undefined) {
    const template = findTemplate(component)
    sourcesRoot ??= findNearestDirToPackageJson(component.node.getSourceFile().fileName)

    const [code, language] = buildCode('component', component, sourcesRoot, template)

    const prompt = PROMPT_TEMPLATE.replace('${LANGUAGE}', language).replace('${COMPONENT}', code)
    return { prompt }
}

function buildCode(type: 'component', component: AngularComponent, sourcesRoot: string, template: AngularTemplate) {
    const language = component.node.getSourceFile().fileName.endsWith('.ts') ? 'Typescript' : 'JavaScript'
    const componentPrompt = [
        'Here is the AngularJS component:',
        `\`\`\`${language.toLowerCase()}`,
        component.node.getText(),
        '```',
    ]

    if (template.resolution === 'inline') {
        return [componentPrompt.join('\n'), language] as const
    }

    const html = resolveTemplateUrl({
        sourcesRoot,
        filePath: component.node.getSourceFile().fileName,
        templateUrl: template.path,
    })

    componentPrompt.push('', 'Here is the html template:', '```html', html, '```')

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
