import type {AngularComponent, UnresolvedUrlTemplate, UrlTemplate} from '../model/AngularEntity'
import * as path from 'path'
import * as fs from 'fs'

export default function resolveTemplates(components: AngularComponent[]): AngularComponent[] {
    return components.map(component => {
        if (!component.template) {
            return component
        }
        if (component.template.resolution === 'inline') {
            return component
        }
        if (component.template.resolution === 'url') {
            return {
                ...component,
                template: resolveTemplateUrl(component.template, component.node.getSourceFile().fileName)
            }
        }
        return component
    })
}

function resolveTemplateUrl(tpl: UnresolvedUrlTemplate, sourceFile: string): UrlTemplate | UnresolvedUrlTemplate {
    const fileDir = sourceFile.split('/').slice(0, -1).join('/')
    const tplPath = path.join(fileDir, tpl.url)
    if (!fs.existsSync(tplPath)) {
        return {
            ...tpl,
            error: Error(`Template ${tplPath} does not exist`)
        }
    }
    return {
        ...tpl,
        text: fs.readFileSync(tplPath, 'utf-8')
    } as UrlTemplate
}
