import type {AngularComponent} from '../../model/AngularEntity'

export type Ng2ReactConversionResult = {
    readonly jsx: string,
    readonly markdown: string
}
export default interface Ng2ReactConverter {
    convert: (component: AngularComponent) => Promise<readonly Ng2ReactConversionResult[]>;
}