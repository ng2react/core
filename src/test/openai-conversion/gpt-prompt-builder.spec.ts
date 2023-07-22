import { SourceFile } from 'typescript'
import { AngularComponent } from '../../lib/model/AngularEntity'
import { buildGptMessage } from '../../lib/modules/openai-conversion/prompt-construction/gpt-prompt-builder'

jest.mock('../../lib/modules/openai-conversion/prompt-construction/find-template', () => ({
    __esModule: true,
    default: jest.fn(() => ({ resolution: 'inline' })),
}))

jest.mock('../../lib/modules/openai-conversion/prompt-construction/find-controller', () => ({
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
        prompt = buildGptMessage(component, {
            sourceRoot: 'src',
            customPrompt: undefined,
            targetLanguage: undefined,
        })
            .map((m) => m.content)
            .join('\n')
    })
    it('Then the prompt specifies Typescript should be generated', () => {
        expect(prompt).toContain('- Your code should be written in Typescript')
    })

    it('Then the prompt should contain tsx examples', () => {
        expect(prompt).toContain('```tsx')
        expect(prompt).not.toContain('```jsx')
    })
})

describe('Given a source file that has a JavaScript extension', () => {
    let component: AngularComponent
    let prompt: string
    beforeAll(() => {
        component = mockComponent({ ex: 'js' })
        prompt = buildGptMessage(component, {
            sourceRoot: 'src',
            customPrompt: undefined,
            targetLanguage: undefined,
        })
            .map((m) => m.content)
            .join('\n')
    })
    it('Then the prompt does not specify Typescript should be generated', () => {
        expect(prompt).toContain('- Your code should be written in JavaScript')
    })

    it('Then the prompt should contain tsx and jsx examples', () => {
        expect(prompt).toContain('```jsx')
        expect(prompt).toContain('```tsx')
    })
})

describe('Given a source file that has a JavaScript extension But Typescript was given as the target', () => {
    let component: AngularComponent
    let prompt: string
    beforeAll(() => {
        component = mockComponent({ ex: 'js' })
        prompt = buildGptMessage(component, {
            sourceRoot: 'src',
            customPrompt: undefined,
            targetLanguage: 'typescript',
        })
            .map((m) => m.content)
            .join('\n')
    })
    it('Then the prompt does not specify Typescript should be generated', () => {
        expect(prompt).toContain('- Your code should be written in Typescript')
    })

    it('Then the prompt should contain tsx examples', () => {
        expect(prompt).toContain('```tsx')
        expect(prompt).not.toContain('```jsx')
    })
})

describe('Given a source file that has a Typescript extension But JavaScript was given as the target', () => {
    let component: AngularComponent
    let prompt: string
    beforeAll(() => {
        component = mockComponent({ ex: 'ts' })
        prompt = buildGptMessage(component, {
            sourceRoot: 'src',
            customPrompt: undefined,
            targetLanguage: 'javascript',
        })
            .map((m) => m.content)
            .join('\n')
    })

    it('Then the prompt does not specify Typescript should be generated', () => {
        expect(prompt).toContain('- Your code should be written in JavaScript')
    })

    it('Then the prompt should contain tsx and jsx examples', () => {
        expect(prompt).toContain('```jsx')
        expect(prompt).toContain('```tsx')
    })
})
