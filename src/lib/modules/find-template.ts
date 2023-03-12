import {type Expression, isObjectLiteralExpression, isStringTextContainingNode, type ObjectLiteralElementLike} from 'typescript'
import type {AngularTemplate, InlineTemplate, UnresolvedUrlTemplate} from '../model/AngularEntity.ts'
import {Logger} from 'tslog'

const logger = new Logger<void>({name: 'find-template'})

/**
 * Takes the second argument of an angularjs component declaration and returns the template
 * @param node
 */
export default function findTemplate(node: Expression): AngularTemplate | UnresolvedUrlTemplate | undefined {
    if (!isObjectLiteralExpression(node)) {
        throw Error('template node is not an object literal expression')
    }
    const templateProp = node.properties.find(prop => prop.name?.getText() === 'template')
    if (templateProp) {
        return getTemplateText(templateProp)
    }
    const templateUrlProp = node.properties.find(prop => prop.name?.getText() === 'templateUrl')
    if (templateUrlProp) {
        return getTemplateFromUrl(templateUrlProp)
    }
    return undefined
}

function getTemplateText(property: ObjectLiteralElementLike): InlineTemplate | undefined {
    const value = getStringValue(property)
    return {
        type: 'template',
        resolution: 'inline',
        node: value,
        text: value.getText()
    }
}

function getTemplateFromUrl(property: ObjectLiteralElementLike): UnresolvedUrlTemplate | undefined {
    const value = getStringValue(property)
    let innerText = value.getText()
    innerText = innerText.slice(1, innerText.length - 1)
    return {
        type: 'template',
        resolution: 'url',
        node: value,
        url: innerText
    }
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