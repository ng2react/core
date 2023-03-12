import {type CallExpression, isStringTextContainingNode, type Node} from 'typescript'
import type {AngularComponent} from '../model/AngularEntity.ts'
import findModule from './find-module.ts'
import findTemplate from './find-template.ts'
import isDeclarationOf from './is-deculation-of.ts'
import {Logger} from 'tslog'
import createAst from './create-ast.ts'

const logger = new Logger<void>({name: 'find-components'})
export default function findComponents(node: Node | string): AngularComponent[] {
    if (typeof node === 'string') {
        node = createAst(node)
    }
    const components: AngularComponent[] = []
    node.forEachChild(childNode => {
        if (isDeclarationOf(childNode, 'component')) {
            components.push(componentFrom(childNode))
        } else {
            components.push(...findComponents(childNode))
        }
    })
    return components
}

function componentFrom(node: CallExpression): AngularComponent {
    const [arg1, arg2] = node.arguments
    let template: AngularComponent['template']
    try {
        template = findTemplate(arg2)
    } catch (e) {
        const err = e as Error
        logger.warn(err.message)
    }
    return {
        type: 'component',
        name: isStringTextContainingNode(arg1) ? arg1.text : 'unknown',
        node,
        module: findModule(node),
        template
    }
}