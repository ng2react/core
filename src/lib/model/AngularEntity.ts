import type { CallExpression, Node } from 'typescript'

export type AngularComponent = Readonly<{
    type: 'component'
    name: string
    node: CallExpression
    module?: AngularModule
}>

export type AngularModule = Readonly<{
    type: 'module'
    name?: string
    node: Node
}>
