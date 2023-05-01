import {
    type Expression,
    isObjectLiteralExpression,
    isStringTextContainingNode,
    type ObjectLiteralElementLike
} from 'typescript'

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
 * @param node
 */
export default function findTemplate(node: Expression): AngularTemplate {
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
    if (!isStringTextContainingNode(initializer)) {
        return false
    }
    const text = initializer.text
    return text.startsWith('require(') && text.endsWith(')')
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
    if (!isStringTextContainingNode(initializer)) {
        throw Error('template initializer is not a string')
    }
    // Remove the require and the quotes
    let innerText = initializer.text
    innerText = innerText.slice(9, innerText.length - 1)
    return innerText
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