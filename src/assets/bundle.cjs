const path = require('path')
const fs = require('fs')

/**
 *
 * @type {string[]}
 */
const prompts = []
for (const file of fs.readdirSync(path.resolve(__dirname))) {
    if (!file.endsWith('.md')) {
        continue
    }
    const promptTemplate = fs.readFileSync(path.resolve(__dirname, file), 'utf-8')
    prompts.push(`export const ${file.split('.')[0].toUpperCase()} = ${JSON.stringify(promptTemplate)}\n`)
}
const promptPath = path.resolve(__dirname, '../lib/generated/prompt-template.ts')
fs.writeFileSync(promptPath, prompts.join('\n'))
