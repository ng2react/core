export default function processResponse(response: string) {
    return {
        jsx: extractJsx(response),
        markdown: extractMarkdown(response),
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
