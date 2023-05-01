
import {MultipleComponents} from './test-data'
import {fail} from 'assert'
import {AngularComponent} from '../lib/model/AngularEntity'
import resolveTemplates from '../lib/modules/parsing/resolve-template'
import findComponentsInNode from '../lib/modules/parsing/find-components-in-node'
import createAst from '../lib/modules/parsing/create-ast'

describe('Given an array of angular components', () => {

    let components: readonly AngularComponent[]
    const getComponent = (name: string) => components.find(c => c.name === name)
    beforeAll(() => {
        const ast = createAst(MultipleComponents.path, MultipleComponents.content)
        components = findComponentsInNode(ast)
    })

    describe('When findComponents is called with the filPath', () => {
        beforeAll(() => {
            components = resolveTemplates(components)
        })
        it('Then templates urls are resolved', () => {
            const template = getComponent('componentWithTemplateUrl')?.template
            if (template?.error) {
                fail('Template failed to resolve: ' + template.error.message)
            }
            expect(template?.text).toContain('<div>Url Template</div>')
        })
    })
})