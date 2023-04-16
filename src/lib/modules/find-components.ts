import {type CallExpression, isStringTextContainingNode, type Node} from 'typescript'
import type {AngularComponent} from '../model/AngularEntity'
import findModule from './find-module'
import findTemplate from './find-template'
import isDeclarationOf from './is-deculation-of'
import createAst from './create-ast'
import getLogger from '../Logger'

const logger = getLogger('find-components')
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