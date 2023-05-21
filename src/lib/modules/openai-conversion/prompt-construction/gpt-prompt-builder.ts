import { AngularComponent } from '../../../model/AngularEntity'
import findTemplate, { AngularTemplate } from './find-template'
import resolveTemplateUrl from './resolve-template-url'
import path from 'path'
import fs from 'fs'
import { PROMPT_PATTERNS, PROMPT_BASE } from '../../../generated/prompt-template'
import findController, { ComponentController } from './find-controller'

type MessageOpts = {
    /**
     * Location of AngularJS sources
     */
    readonly sourceRoot: string | undefined
    /**
     * Additional prompt text that can be used to add custom rules
     */
    readonly customPrompt: string | undefined

    readonly targetLanguage: 'typescript' | 'javascript' | undefined
}

export function buildGptMessage(
    component: AngularComponent,
    { sourceRoot, customPrompt, targetLanguage }: MessageOpts
) {
    const template = findTemplate(component)
    const controller = findController(component)

    sourceRoot ??= findNearestDirToPackageJson(component.node.getSourceFile().fileName)

    const [code, language] = buildCode('component', component, sourceRoot, template, controller)

    const prompt = [
        PROMPT_BASE.replace('${LANGUAGE}', targetLanguage ?? language),
        customPrompt ?? PROMPT_PATTERNS,
        'The AngularJS Component:',
        '========================',
        code,
    ].join('\n')

    return { prompt }
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
