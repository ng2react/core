import {OpenAIOptions} from '../modules/openai-conversion/openai-converter'

type NgComponentOptions = {
    /**
     * The absolute path to the file containing the component.
     */
    readonly file: string,
    /**
     * The name of the component/directive to convert.
     */
    readonly componentName: string,

}

type ConvertOptions = NgComponentOptions & Partial<OpenAIOptions>

export default ConvertOptions