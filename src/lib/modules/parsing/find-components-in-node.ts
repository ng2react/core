import { type CallExpression, isStringTextContainingNode, type Node } from 'typescript'
import type { AngularComponent } from '../../model/AngularEntity'
import findModule from './find-module'
import isDeclarationOf from './is-deculation-of'
import getLogger from '../../Logger'

export default function findComponentsInNode(node: Node): Readonly<AngularComponent[]> {
    const logger = getLogger('find-components')

    const components: AngularComponent[] = []
    node.forEachChild((childNode) => {
        if (isDeclarationOf(childNode, 'component')) {
            components.push(componentFrom(childNode))
        } else {
            components.push(...findComponentsInNode(childNode))
        }
    })
    return components

    function componentFrom(node: CallExpression) {
        const [arg1] = node.arguments
        return {
            type: 'component',
            name: isStringTextContainingNode(arg1) ? arg1.text : 'unknown',
            node,
            module: findModule(node),
        } satisfies AngularComponent
    }
}
