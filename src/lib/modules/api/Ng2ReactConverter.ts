import type {AngularComponent} from '../../model/AngularEntity'

export default interface Ng2ReactConverter {
    convert: (component: AngularComponent) => Promise<string[]>;
}