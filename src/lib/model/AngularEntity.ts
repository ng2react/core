import type {Node} from 'typescript'

export type AngularComponent = Readonly<{
    type: 'component'
    name: string
    template?: AngularTemplate,
    node: Node,
    module?: AngularModule
}>

export type AngularModule = Readonly<{
    type: 'module'
    name?: string
    node: Node
}>

export type AngularTemplate = InlineTemplate | UrlTemplate | UnresolvedUrlTemplate

export type InlineTemplate = Readonly<{
    type: 'template'
    resolution: 'inline'
    node: Node
    text: string
    url?: never
    error?: never
}>

export type UnresolvedUrlTemplate = Readonly<{
    type: 'template'
    resolution: 'url'
    node: Node
    url: string,
    error?: Error
    text?: never
}>

export type UrlTemplate = UnresolvedUrlTemplate & Readonly<{
    text: string
    error?: never
}>