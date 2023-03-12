import { type CallExpression, type Node, isExpressionStatement, isStringTextContainingNode } from 'typescript'
import type { AngularModule } from '../model/AngularEntity.ts'
import isDeclarationOf from './is-deculation-of.ts'

export default function findModule(node: Node): AngularModule | undefined {
    const moduleNode = findModuleNode(node)
    if (moduleNode) {
        const name = (() => {
            const [arg1,] = moduleNode?.arguments ?? []
            return arg1 && isStringTextContainingNode(arg1) ? arg1.text : undefined
        })()
        return {
            type: 'module',
            name,
            node: moduleNode
        }
    }


    if (!isExpressionStatement(node.parent)) {
        return undefined
    }

    const moduleVar = node.parent.getFirstToken()
    if (!moduleVar) {
        return undefined
    }

    return {
        type: 'module',
        node: moduleVar
    }

    function findModuleNode(node: Node): CallExpression | undefined {
        return node.forEachChild<CallExpression>((childNode) => {
            if (isDeclarationOf(childNode, 'module')) {
                return childNode
            }
            const moduleNode = findModuleNode(childNode)
            if (moduleNode) {
                return moduleNode
            }
            if (isExpressionStatement(childNode)) {
                childNode.getFirstToken()
            }
        })
    }

}