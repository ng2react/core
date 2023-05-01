
import {MultipleComponents} from './test-data'
import {AngularComponent, InlineTemplate} from '../lib/model/AngularEntity'
import findComponentsInNode from '../lib/modules/parsing/find-components-in-node'
import createAst from '../lib/modules/parsing/create-ast'

describe('Given an array of angular modules When findComponents is called', () => {

    let components: readonly AngularComponent[]
    const getComponent = (name: string) => components.find(c => c.name === name)
    beforeAll(() => {
        const ast = createAst(MultipleComponents.path, MultipleComponents.content)
        components = findComponentsInNode(ast)
    })
    it('Then all modules are found', () => {
        expect(components).toHaveLength(MultipleComponents.componentsCount)
    })

    it('Then all module names are correct', () => {
        expect(components[0].name).toEqual('componentWithClassCtrl')
    })

    it('Then all module snippets are correct', () => {
        for (const component of components) {
            if (component.module?.name) {
                expect(component.module.name).toEqual(`${component.name}Module`)
                expect(component.module.node.getText()).toEqual(`angular.module('${component.name}Module', [])`)
            } else {
                expect(component.module?.node.getText()).toEqual(`${component.name}ConstName`)
            }
        }
    })

    it('Then inline templates are discovered', () => {
       const template = getComponent('componentWithInlineTemplate')?.template as InlineTemplate
       expect(template.text).toContain('<div>Inline template</div>')
    })
})