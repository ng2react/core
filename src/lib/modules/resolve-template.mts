import {
    AngularComponent,
    AngularModule,
    AngularTemplate,
    UnresolvedUrlTemplate,
    UrlTemplate
} from "../model/AngularEntity.js";
import path from "path";
import * as fs from "fs";

export default function resolveTemplates(components: AngularComponent[], opt: {filePath: string}): AngularComponent[] {
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
                template: resolveTemplateUrl(component.template, opt)
            }
        }
        return component
    })
}
function resolveTemplateUrl(tpl: UnresolvedUrlTemplate, opt: {filePath: string}): UrlTemplate|UnresolvedUrlTemplate {
    const fileDir = opt.filePath.split('/').slice(0, -1).join('/')
    const tplPath =  path.join(fileDir, tpl.url)
    if (!fs.existsSync(tplPath)) {
        return {
            ...tpl,
            error: Error(`Template ${tplPath} does not exist`)
        }
    }
    return {
        ...tpl,
        text: fs.readFileSync(tplPath, 'utf-8')
    }
}
