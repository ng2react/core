import type { CallExpression, Node } from "typescript"


export type AngularComponent = {
    type: 'component'
    name: string
    template?: string,
    node: Node,
    module?: AngularModule
}

export type AngularModule = {
    type: 'module'
    name?: string
    node: Node
}