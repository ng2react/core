import type {AngularComponent} from '../../model/AngularEntity'

/**
 * Write the component as a string, with all referenced code inline.
 * For example: A component that uses a template url will have the template inline.
 *
 * This enables us to submit the code to OpenAI in a single request.
 */
export default function toStringComponent(component: AngularComponent) {
    if (component.template?.resolution === 'inline') {
        return component.node.getText()
    }
}