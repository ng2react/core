import toStringComponent from './tostring-component'
import {AngularComponent} from '../../model/AngularEntity'


export function buildPrompt(type: 'component', component: AngularComponent) {
    return 'Please convert the following AngularJS component to a functional React element.' +
        '\n * You should explain any assumptions you have made and highlight any potential issues.' +
        '\n * So that I can programmatically find your code, please top and tail it with "// ___NG2R_START___" and "// ___NG2R_STOP___"' +
        '\n\nHere is the AngularJS component:\n\n'
        + toStringComponent(component)
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
    if (response.includes('```')) {
        // Assume is markdown
        return response
    } else {
        // Assume is plaintext
        return '```jsx\n' + response + '\n```'
    }
}