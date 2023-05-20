import { AngularComponent } from '../lib/model/AngularEntity'
import findComponentsInNode from '../lib/modules/parsing/find-components-in-node'
import createAst from '../lib/modules/parsing/create-ast'
import fs from 'fs'
import path from 'path'
import findController, {
    ComponentController,
    ControllerNode,
} from '../lib/modules/openai-conversion/prompt-construction/find-controller'

const testFilePath = path.resolve(__dirname, 'test_data/find-controller.js')
const testFileContent = fs.readFileSync(testFilePath, 'utf-8')

function getComponent(name: string): AngularComponent {
    const ast = createAst(testFilePath, testFileContent)
    return findComponentsInNode(ast).find((c) => c.name === name)!
}

describe('Given a referenced class controller', () => {
    let componentCtrl: ComponentController
    beforeAll(() => {
        const component = getComponent('classCtrl')
        componentCtrl = findController(component)
    })
    it('The the component resolution type is "node"', () => {
        expect(componentCtrl.resolution).toEqual('node')
    })

    it('Then the node is the controller', () => {
        expect((componentCtrl as ControllerNode).node?.getText()).toContain('class ClassCtrl {')
    })
})

describe('Given a referenced function controller', () => {
    let componentCtrl: ComponentController
    beforeAll(() => {
        const component = getComponent('fnCtrl')
        componentCtrl = findController(component)
    })
    it('The the component resolution type is "node"', () => {
        expect(componentCtrl.resolution).toEqual('node')
    })

    it('Then the node is the controller', () => {
        expect((componentCtrl as ControllerNode).node?.getText()).toContain('function FnCtrl() {')
    })
})

describe('Given a referenced const controller', () => {
    let componentCtrl: ComponentController
    beforeAll(() => {
        const component = getComponent('constCtrl')
        componentCtrl = findController(component)
    })
    it('The the component resolution type is "node"', () => {
        expect(componentCtrl.resolution).toEqual('node')
    })

    it('Then the node is the controller', () => {
        expect((componentCtrl as ControllerNode).node?.getText()).toContain('ConstCtrl = [')
    })
})

describe('Given a component with no controller', () => {
    let componentCtrl: ComponentController
    beforeAll(() => {
        const component = getComponent('noCtrl')
        componentCtrl = findController(component)
    })
    it('The the component resolution type is "inline"', () => {
        expect(componentCtrl.resolution).toEqual('inline')
    })
})

describe('Given a component with an inline controller', () => {
    let componentCtrl: ComponentController
    beforeAll(() => {
        const component = getComponent('inlineCtrl')
        componentCtrl = findController(component)
    })
    it('The the component resolution type is "inline"', () => {
        expect(componentCtrl.resolution).toEqual('inline')
    })
})

describe('Given a component with a string referenced controller', () => {
    it('The the component resolution type is "inline"', () => {
        try {
            const component = getComponent('stringCtrl')
            findController(component)
            fail('Expected an error to be thrown')
        } catch (e) {
            expect((e as Error).message).toEqual('Unable to support controllers referenced by name')
        }
    })
})
