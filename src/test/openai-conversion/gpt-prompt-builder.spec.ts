import { SourceFile } from 'typescript'
import { AngularComponent } from '../../lib/model/AngularEntity'
import { buildGptMessage } from '../../lib/modules/openai-conversion/prompt-construction/gpt-prompt-builder'

jest.mock('../../lib/modules/openai-conversion/prompt-construction/find-template', () => ({
    __esModule: true,
    default: jest.fn(() => ({ resolution: 'inline' })),
}))

function mockComponent({ ex = 'js' as 'js' | 'ts' }) {
    return {
        name: '',
        node: {
            getText: () => 'component',
            getSourceFile: () =>
                ({
                    fileName: `src/app/app.component.${ex}`,
                } as SourceFile),
        },
    } as AngularComponent
}

describe('Given a source file that has a Typescript extension', () => {
    let component: AngularComponent
    let prompt: string
    beforeAll(() => {
        component = mockComponent({ ex: 'ts' })
        prompt = buildGptMessage(component, 'src').prompt
    })
    it('Then the prompt specifies Typescript should be generated', () => {
        expect(prompt).toContain('The output should be in Typescript')
    })
})

describe('Given a source file that has a JavaScript extension', () => {
    let component: AngularComponent
    let prompt: string
    beforeAll(() => {
        component = mockComponent({ ex: 'js' })
        prompt = buildGptMessage(component, 'src').prompt
    })
    it('Then the prompt does not specify Typescript should be generated', () => {
        expect(prompt).not.toContain('* Please use TypeScript')
    })
})
