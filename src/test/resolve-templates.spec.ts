import {expect} from 'chai'
import {describe, it} from 'mocha'
import {AngularComponent, UnresolvedUrlTemplate, UrlTemplate} from '../lib/model/AngularEntity.ts'
import findComponentsInModule from '../lib/modules/find-components.mts'
import {MultipleComponents} from './test-data.ts'
import resolveTemplates from '../lib/modules/resolve-template.mts'
import {fail} from "assert";

const content = MultipleComponents.content
describe('Given an array of angular components', () => {

    let components: AngularComponent[]
    const getComponent = (name: string) => components.find(c => c.name === name)
    before(() => {
        components = findComponentsInModule(content)
    })

    describe('When findComponents is called with the filPath', () => {
        before(() => {
            components = resolveTemplates(components, {filePath: MultipleComponents.path})
        })
        it('Then templates urls are resolved', () => {
            const template = getComponent('componentWithTemplateUrl')?.template as UrlTemplate
            if (template.error) {
                fail('Template failed to resolve: ' + template.error.message)
            }
            expect(template?.text).to.contain('<div>Url Template</div>')
        })
    })
})