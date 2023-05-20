import ts, {
    forEachChild,
    Identifier,
    isClassDeclaration,
    isClassExpression,
    isFunctionDeclaration,
    isFunctionLike,
    isIdentifier,
    isLeftHandSideExpression,
    isObjectLiteralExpression,
    isPropertyDeclaration,
    isStringTextContainingNode,
    isVariableDeclaration,
    isVariableStatement,
    Node,
    type ObjectLiteralElementLike,
} from 'typescript'
import { AngularComponent } from '../../../model/AngularEntity'
import getLogger from '../../../Logger'

export type ComponentController = InlineController | ControllerNode

export type InlineController = Readonly<{
    resolution: 'inline'
}>

export type ControllerNode = Readonly<{
    resolution: 'node'
    node: Node
}>

/**
 * Takes the second argument of an angularjs component declaration and returns the controller
 */
export default function findController({ node }: Pick<AngularComponent, 'node'>): ComponentController {
    const opts = node.arguments[1]
    if (!isObjectLiteralExpression(opts)) {
        throw Error('template node is not an object literal expression')
    }
    const controllerProp = opts.properties.find((prop) => prop.name?.getText() === 'controller')

    if (!controllerProp) {
        return { resolution: 'inline' } // No template
    }
    if (isStringReference(controllerProp)) {
        throw Error('Unable to support controllers referenced by name')
    }
    if (isInline(controllerProp)) {
        return {
            resolution: 'inline',
        } satisfies InlineController
    }

    if (!isVariable(controllerProp)) {
        // getLogger('find-controller').info('Unable to find controller')
        // Assume that it was inline
        return { resolution: 'inline' } // Looks like it's an inline template
    }
    const controllerDeclaration = getDeclaration(controllerProp)
    return {
        resolution: 'node',
        node: controllerDeclaration,
    }
}

/**
 * Returns true if the value is a variable referenced somewhere else in the code
 */
function isVariable(controllerProp: ObjectLiteralElementLike): controllerProp is ObjectLiteralElementLike & {
    initializer: Identifier
} {
    if (!('initializer' in controllerProp)) {
        throw Error('template property is not an initializer')
    }
    const value = controllerProp.initializer

    return isIdentifier(value)
}

/**
 * Returns the node containing to the variable declaration of the controller value
 */
function getDeclaration(controllerProp: ObjectLiteralElementLike & { initializer: Identifier }): Node {
    const initializer = controllerProp.initializer
    if (!isIdentifier(initializer)) {
        throw Error('controller property is not an identifier')
    }
    const declarationName = ts.getNameOfDeclaration(initializer)
    if (!declarationName) {
        throw Error('Unable to find declarationName of controller')
    }
    const varName = declarationName.getText()
    const declaration = findNamedDeclaration(controllerProp.getSourceFile(), varName)

    if (!declaration) {
        throw Error(`Unable to find declaration of controller ${varName}`)
    }
    return declaration
}

function findNamedDeclaration(node: Node, name: string): Node | undefined {
    return forEachChild(node, (child) => {
        if (isClassDeclaration(child) || isClassExpression(child)) {
            if (child.name?.getText() === name) {
                return child
            }
        }
        if (isVariableStatement(node)) {
            const { declarations } = node.declarationList
            if (declarations.length === 1 && declarations[0].name.getText() === name) {
                return declarations[0]
            }
        }
        if (isFunctionLike(node)) {
            if (node.name?.getText() === name) {
                return node
            }
        }
        return findNamedDeclaration(child, name)
    })
}

/**
 * Returns true if the value is instantiated inline
 */
function isInline(controllerProp: ObjectLiteralElementLike) {
    if (!('initializer' in controllerProp)) {
        throw Error('template property is not an initializer')
    }
    const value = controllerProp.initializer

    return isObjectLiteralExpression(value)
}

function isStringReference(property: ObjectLiteralElementLike) {
    if (!('initializer' in property)) {
        throw Error('template property is not an initializer')
    }
    const value = property.initializer

    return isStringTextContainingNode(value)
}
