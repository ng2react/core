import {MultipleComponents} from './test-data'
import {fail} from 'assert'
import {AngularComponent} from '../lib/model/AngularEntity'
import {search} from '../lib/api/main'
import findTemplate, {TemplateUrl} from '../lib/modules/openai-conversion/prompt-construction/find-template'
import resolveTemplateUrl from '../lib/modules/openai-conversion/prompt-construction/resolve-template-url'

describe('Given an array of angular components', () => {

    let components: readonly AngularComponent[]
    const getComponent = (name: string) => components.find(c => c.name === name)
    beforeAll(() => {
        components = search(MultipleComponents.content, {filename: MultipleComponents.path})
    })

    describe('When findComponents is called with the filPath', () => {
        const testCases = [
            ['componentWithInlineTemplate', 'inline', undefined],
            ['componentWithTemplateUrl', 'url', '<div>Url Template</div>'],
            ['componentWithNoTemplate', 'inline', undefined],
            ['componentWithUnmappedTemplateUrl', 'url', '<div>componentWithUnmappedTemplateUrl.tpl.html</div>'],
            ['componentWithRequiredTemplate', 'url', '<div>Required Template</div>']
        ] as const

        it.each(testCases)('Then %s template is resolved as %s', (componentName, expectedResolution, expectedHtml) => {
            const component = getComponent(componentName)
            if (!component) {
                fail('Component not found: ' + componentName)
            }
            const tpl = findTemplate(component)
            expect(tpl).toBeDefined()
            expect(tpl.resolution).toBe(expectedResolution)
            if (tpl.resolution !== 'url') {
                return
            }
            const html = resolveTemplateUrl({
                sourcesRoot: __dirname,
                filePath: component.node.getSourceFile().fileName,
                templateUrl: (tpl as TemplateUrl).path
            })
            expect(html.trim()).toBe(expectedHtml)
        })
    })
})