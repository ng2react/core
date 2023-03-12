import type {AngularComponent} from '../model/AngularEntity.ts'
import {getSourceDir} from './ast-utils.ts'
import path from 'path'
import fs from 'fs'
import {TEMPLATE_DIR} from '../constants.ts'
import {startCase} from 'lodash'
import {createSourceFile, ScriptTarget} from 'typescript'

export default function createReactComponent(component: AngularComponent) {
    const newFileContent = buildTemplate(component)
    const newFilePath = getReactFilePath(component)
    return createSourceFile(newFilePath, newFileContent,  ScriptTarget.Latest, true)
}

function buildTemplate(component: AngularComponent): string {
    return fs.readFileSync(path.join(TEMPLATE_DIR, 'react-component.jsx'), 'utf8')
        .replaceAll('__COMPONENT_NAME__', startCase(component.name))
        .replaceAll('__PROPS__', '')
        .replaceAll('__TEMPLATE__', component.template?.text ?? '')
        .replaceAll('__IMPORTS__', 'import React from \'react\'')
        .replaceAll('__HOOKS__', '')
        .replaceAll('__STATE__', '')
        .replaceAll('__LOGIC__', '')
}

export function getReactFilePath(component: AngularComponent) {
    const fileDir = getSourceDir(component.node)
    let newFilePath = path.join(fileDir, `${component.name}.jsx`)
    if (fs.existsSync(newFilePath)) {
        newFilePath = path.join(fileDir, `${component.name}.converted.jsx`)
    }
    return newFilePath
}