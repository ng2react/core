type ConvertOptions = {
    readonly apiKey?: string,
    readonly model?: string,
    readonly organization?: string,
    /**
     * The root directory of the project. If not specified, the directory below that of the
     * nearest package.json file will be used.
     */
    readonly sourceRoot?: string
}

export default ConvertOptions