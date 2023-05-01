import * as path from 'path'
import * as fs from 'fs'
import getLogger from '../../../Logger'

const logger = getLogger('resolveTemplateUrl')
export default function resolveTemplateUrl({filePath, templateUrl, sourcesRoot}: {
    filePath: string,
    sourcesRoot: string,
    templateUrl: string
}): string {
    const fileDir = filePath.split('/').slice(0, -1).join('/')
    const relPath = path.resolve(fileDir, templateUrl)
    if (fs.existsSync(relPath)) {
        return fs.readFileSync(relPath, 'utf-8')
    }

    return findBestMatch(templateUrl, sourcesRoot)
}

/**
 *  Find the best match for the given template URL.by searching all files in the project.
 *  Match the last name in the path, then the second last, etc.
 *
 * Step 1:
 * @param filePath
 * @param sourcesRoot
 */
function findBestMatch(filePath: string, sourcesRoot: string) {
    const filename = path.parse(filePath).name
    logger.debug(`Searching for ${filename} in ${sourcesRoot}`)

    const files = findFilesInDir(sourcesRoot)
    if (files.length === 0) {
        throw Error(`Could not find ${filename} under ${sourcesRoot}`)
    }
    if (files.length === 1) {
        return files[0]
    }
    const bestMatch = files.find(f => f.endsWith(filePath))
    if (!bestMatch) {
        throw Error(`Found multiple matches for ${filename} under ${sourcesRoot}:\n - ${files.join('\n - ')}`)
    }
    return bestMatch

    function findFilesInDir(dirName: string): string[] {
        const files = fs.readdirSync(dirName, {withFileTypes: true})
        return files.map(f => {
            if (f.isFile() && f.name === filename) {
                return [path.resolve(dirName, f.name)]
            }
            if (f.isDirectory()) {
                return findFilesInDir(path.resolve(dirName, f.name))
            }
            return []
        }).flat().filter(f => !!f)
    }
}
