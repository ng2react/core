import {expect} from 'chai'
import {describe, it} from 'mocha'
import {AngularComponent, InlineTemplate} from '../lib/model/AngularEntity.ts'
import findComponentsInModule from '../lib/modules/find-components.mts'
import {MultipleComponents} from './test-data.ts'

const content = MultipleComponents.content
const COMPONENT_COUNT = MultipleComponents.componentsCount
describe('Given an array of angular modules When findComponents is called', () => {

    let components: AngularComponent[]
    const getComponent = (name: string) => components.find(c => c.name === name)
    before(() => {
        components = findComponentsInModule(content)
    })
    it('Then all modules are found', () => {
        expect(components).to.have.lengthOf(COMPONENT_COUNT)
    })

    it('Then all module names are correct', () => {
        expect(components[0].name).to.equal('componentWithClassCtrl')
    })

    it('Then all module snippets are correct', () => {
        for (const component of components) {
            if (component.module?.name) {
                expect(component.module.name).to.equal(`${component.name}Module`)
                expect(component.module.node.getText()).to.equal(`angular.module('${component.name}Module', [])`)
            } else {
                expect(component.module?.node.getText()).to.equal(`${component.name}ConstName`)
            }
        }
    })

    it('Then inline templates are discovered', () => {
       const template = getComponent('componentWithInlineTemplate')?.template as InlineTemplate
       expect(template.text).to.contain('<div>Inline template</div>')
    })
})