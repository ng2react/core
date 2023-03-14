import {expect} from 'chai'
import {describe, it} from 'mocha'
import type {AngularComponent} from '../lib'
import findComponentsInModule from '../lib/modules/find-components'
import {MultipleComponents} from './test-data'
import resolveTemplates from '../lib/modules/resolve-template'
import {fail} from 'assert'

describe('Given an array of angular components', () => {

    let components: AngularComponent[]
    const getComponent = (name: string) => components.find(c => c.name === name)
    before(() => {
        components = findComponentsInModule(MultipleComponents.path)
    })

    describe('When findComponents is called with the filPath', () => {
        before(() => {
            components = resolveTemplates(components)
        })
        it('Then templates urls are resolved', () => {
            const template = getComponent('componentWithTemplateUrl')?.template
            if (template?.error) {
                fail('Template failed to resolve: ' + template.error.message)
            }
            expect(template?.text).to.contain('<div>Url Template</div>')
        })
    })
})