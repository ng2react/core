import {describe, it} from 'mocha'
import findComponentsInModule from '../../lib/modules/find-components'
import {TodoList} from '../test-data'
import createReactComponent from '../../lib/modules/manual-conversion/create-react-component'
import type {SourceFile} from 'typescript'
import resolveTemplates from '../../lib/modules/resolve-template'
import {expect} from 'chai'

describe('Given a successfully analysed angular component When createReactComponent is called', () => {
    let output: SourceFile
    before(() => {
        const [component] = resolveTemplates(findComponentsInModule(TodoList.path))

        output = createReactComponent(component)
    })

    it('Then the file contains the angular template', () => {
        console.log(output.getText())
        expect(output.getText()).to.contain('<h1>Todo List</h1>')
    })
})