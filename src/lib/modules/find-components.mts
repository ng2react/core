import {CallExpression, createSourceFile, isStringTextContainingNode, Node, ScriptTarget} from "typescript";
import {AngularComponent} from "../model/AngularEntity.ts";
import findModule from "./find-module.mts";
import findTemplate from "./find-template.mts";
import isDeclarationOf from "./is-deculation-of.mts";
import {Logger} from "tslog";

const logger = new Logger<void>({name: 'find-components'})
export default function findComponents(source: Node | string) {
    let node: Node
    if (typeof source === 'string') {
        node = createSourceFile('test.ts', source, ScriptTarget.Latest, true);
    } else {
        node = source
    }
    let components: AngularComponent[] = [];
    node.forEachChild(childNode => {
        if (isDeclarationOf(childNode, 'component')) {
            components.push(componentFrom(childNode));
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