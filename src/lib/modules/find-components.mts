import { CallExpression, ExpressionStatement, Node, ScriptTarget, createSourceFile, forEachChild, isCallExpression, isExpressionStatement, isPropertyAccessExpression, isStringTextContainingNode, isVariableDeclaration } from "typescript";
import { AngularComponent, AngularModule } from "../model/AngularEntity.ts";

export default function findComponents(source: Node | string) {
    let node: Node
    if (typeof source === 'string') {
        node = createSourceFile('test.ts', source, ScriptTarget.Latest, true);
    } else {
        node = source
    }
    const components: AngularComponent[] = [];
    node.forEachChild(childNode => {
        if (isDeclarationOf(childNode, 'component')) {
            components.push(componentFrom(childNode));
        } else {
            components.push(...findComponents(childNode))
        }
    })
    return components;
}

function componentFrom(node: CallExpression): AngularComponent {
    const [arg1, arg2] = node.arguments
    return {
        type: 'component',
        name: isStringTextContainingNode(arg1) ? arg1.text : 'unknown',
        node,
        module: findModule(node)
    }
}

function findModule(node: Node): AngularModule | undefined {
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

function isDeclarationOf(node: Node, type: 'component' | 'module'): node is CallExpression {
    if (!isCallExpression(node)) {
        return false
    }
    const expression = node.expression;
    if (!isPropertyAccessExpression(expression)) {
        return false
    }
    const name = expression.name?.text;
    return name === type;
}