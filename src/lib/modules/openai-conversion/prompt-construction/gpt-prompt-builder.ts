import {AngularComponent} from '../../../model/AngularEntity'
import findTemplate from './find-template'
import resolveTemplateUrl from './resolve-template-url'


export function buildPrompt(type: 'component', component: AngularComponent, sourcesRoot: string): string {
    const promptLines = [
        'Please convert the following AngularJS component to a functional React element.',
        ' * You should explain any assumptions you have made and highlight any potential issues.',
        ' * So that I can programmatically find your code, please top and tail it with "// ___NG2R_START___" and "// ___NG2R_STOP___"'
    ]

    const template = findTemplate(component)
    if (template.resolution === 'inline') {
        promptLines.push('\nHere is the AngularJS component:\n')
        promptLines.push(component.node.getText())
    } else {
        const html = resolveTemplateUrl({
            sourcesRoot,
            filePath: component.node.getSourceFile().fileName,
            templateUrl: template.path
        })
        promptLines.push('\nHere is the AngularJS component along with its template:\n')
        promptLines.push('```ts\n' + component.node.getText() + '\n```')
        promptLines.push('```html\n' + html + '\n```')
    }

    return promptLines.join('\n')
}

export function processResponse(response: string) {
    return {
        jsx: extractJsx(response),
        markdown: extractMarkdown(response)
    }
}

function extractJsx(markdown: string) {
    return /(?<=\/\/ ___NG2R_START___\n)[\s\S]*?(?=\/\/ ___NG2R_STOP___)/.exec(markdown)?.[0] ?? ''
}

function extractMarkdown(response: string) {
    response = response.replaceAll(/\/\/ (___NG2R_START___|___NG2R_STOP___)/g, '')
    if (response.includes('```')) {
        // Assume is markdown
        return response
    } else {
        // Assume is plaintext
        return '```jsx\n' + response + '\n```'
    }
}