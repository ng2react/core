import type { AngularComponent } from '../../model/AngularEntity'

export type Ng2ReactConversionResult = {
    readonly prompt: string
    readonly results: {
        readonly jsx: string
        readonly markdown: string
    }[]
}
export default interface Ng2ReactConverter {
    convert: (component: AngularComponent) => Promise<Ng2ReactConversionResult>
}
