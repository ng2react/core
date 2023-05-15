import { type CallExpression, type Node, isCallExpression, isPropertyAccessExpression } from 'typescript'

export default function isDeclarationOf(node: Node, type: 'component' | 'module'): node is CallExpression {
    if (!isCallExpression(node)) {
        return false
    }
    const expression = node.expression
    if (!isPropertyAccessExpression(expression)) {
        return false
    }
    const name = expression.name?.text
    return name === type
}
