const path = require('path')
const fs = require('fs')

const promptTemplatePath = require.resolve('#prompt-template.md')
const promptTemplate = fs.readFileSync(promptTemplatePath, 'utf8')

const promptPath = path.resolve(__dirname, '../lib/generated/prompt-template.ts')
fs.writeFileSync(
    promptPath,
    `const PROMPT_TEMPLATE = ${JSON.stringify(promptTemplate)}\nexport default PROMPT_TEMPLATE`
)
