import {describe, it} from 'mocha'
import findComponentsInModule from '../lib/modules/find-components.ts'
import {TodoList} from './test-data.ts'
import createReactComponent from '../lib/modules/create-react-component.ts'
import type {SourceFile} from 'typescript'
import resolveTemplates from '../lib/modules/resolve-template.ts'
import {expect} from 'chai';

describe('Given a successfully analysed angular component When createReactComponent is called', () => {
    let output: SourceFile
    before(() => {
        const [component] = resolveTemplates(findComponentsInModule(TodoList.path))

        output = createReactComponent(component)
    })

    it('Then the file contains the angular template', () => {
        expect(output.getText()).to.contain('<h1>Todo List</h1>')
    })
})