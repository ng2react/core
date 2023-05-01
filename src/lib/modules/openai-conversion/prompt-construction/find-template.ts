import {
    isCallExpression,
    isLeftHandSideExpression,
    isObjectLiteralExpression,
    isStringTextContainingNode,
    type ObjectLiteralElementLike
} from 'typescript'
import {AngularComponent} from '../../../model/AngularEntity'

export type AngularTemplate = InlineTemplate | TemplateUrl

export type InlineTemplate = Readonly<{
    resolution: 'inline'
}>

export type TemplateUrl = Readonly<{
    resolution: 'url'
    path: string
}>

/**
 * Takes the second argument of an angularjs component declaration and returns the template
 */
export default function findTemplate(component: AngularComponent): AngularTemplate {
    const node = component.node.arguments[1]
    if (!isObjectLiteralExpression(node)) {
        throw Error('template node is not an object literal expression')
    }
    const templateProp = node.properties.find(prop => prop.name?.getText() === 'template')
    const templateUrlProp = node.properties.find(prop => prop.name?.getText() === 'templateUrl')

    if (templateUrlProp) {
        return getTemplateFromUrlProp(templateUrlProp)
    }
    if (!templateProp) {
        return {resolution: 'inline'} // No template
    }
    if (isRequireStatement(templateProp)) {
        const requirePath = getPathFromRequireStatement(templateProp)
        return getTemplateFromUrl(requirePath)
    }
    return {resolution: 'inline'} // Looks like it's an inline template
}

/**
 * Returns true if the property is a require statement, e.g:
 * template: require('./template.html')
 */
function isRequireStatement(node: ObjectLiteralElementLike) {
    if (!('initializer' in node)) {
        return false
    }
    const initializer = node.initializer
    if (!isCallExpression(initializer)) {
        return false
    }
    const expression = initializer.expression
    if (!isLeftHandSideExpression(expression)) {
        return false
    }
    return expression.getText() === 'require'
}

/**
 * Returns the path from a require statement, e.g:
 * template: require('./template.html')
 * returns: ./template.html
 * @param node
 */
function getPathFromRequireStatement(node: ObjectLiteralElementLike) {
    if (!('initializer' in node)) {
        throw Error('template property is not an initializer')
    }
    const initializer = node.initializer
    if (!isCallExpression(initializer)) {
        throw Error('template initializer is not a require statement')
    }
    // Remove the quotes
    const innerText = initializer.arguments[0].getText()
    return innerText.slice(1, innerText.length - 1)
}

function getTemplateFromUrlProp(property: ObjectLiteralElementLike) {
    const value = getStringValue(property)
    let innerText = value.getText()
    innerText = innerText.slice(1, innerText.length - 1)
    return getTemplateFromUrl(innerText)
}

/**
 * Searches local file structure for the template
 * @param url
 */
function getTemplateFromUrl(url: string) {
    return {
        resolution: 'url',
        path: url
    } satisfies TemplateUrl
}

function getStringValue(property: ObjectLiteralElementLike) {
    if (!('initializer' in property)) {
        throw Error('template property is not an initializer')
    }
    const value = property.initializer

    if (!isStringTextContainingNode(value)) {
        throw Error('template initializer is not a string')
    }
    return value
}