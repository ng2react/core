import { expect } from 'chai';
import fs from 'fs';
import { describe, it } from 'mocha';
import path from 'path';
import { AngularComponent } from '../lib/model/AngularEntity.ts';
import findComponentsInModule from '../lib/modules/find-components.mts';

const TODO_COMPONENT = path.resolve(__dirname, 'test_data/components.js');

describe('Given an array of angular modules When findComponents is called', () => {
    const content = fs.readFileSync(TODO_COMPONENT, 'utf-8')
    let components: AngularComponent[];
    before(() => {
        components = findComponentsInModule(content)
    })
    it('Then all modules are found', () => {
        expect(components).to.have.lengthOf(2)
    })

    it('Then all module names are correct', () => {
        expect(components[0].name).to.equal('componentWithClassCtrl')
    })

    it('Then all module names are correct', () => {
        for (const component of components) {
            if (component.module?.name) {
                expect(component.module.name).to.equal(`${component.name}Module`)
                expect(component.module.node.getText()).to.equal(`angular.module('${component.name}Module', [])`)
            } else {
                expect(component.module?.node.getText()).to.equal(`${component.name}ConstName`)
            }
        }
    });
})