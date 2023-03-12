#!/usr/bin/env node

import yargs from 'yargs'
import findComponents from '../lib/modules/find-components.ts'
import resolveTemplates from '../lib/modules/resolve-template.ts'
import path from 'path'
import createReactComponent, {getReactFilePath} from '../lib/modules/create-react-component.ts'
import fs from 'fs'

void yargs(process.argv)
    .command<{ filename: string, cwd: string }>('convert <filename>', 'Converts angular components to react',
        (yargs) => yargs
            .positional('filename', {
                describe: 'The file to convert',
                type: 'string'
            }),
        (argv) => {
            console.log('Converting angular components to react')
            argv.filename = path.resolve(argv.cwd, argv.filename)
            let components = findComponents(argv.filename)
            components = resolveTemplates(components)
            for (const component of components) {
                const fileName = getReactFilePath(component)
                const reactSource = createReactComponent(component)
                fs.writeFileSync(fileName, reactSource.getText())
            }
        })
    .options('cwd', {
        describe: 'The current working directory',
        type: 'string',
        default: process.cwd()
    })
    .strict()
    .help()
    .parse()