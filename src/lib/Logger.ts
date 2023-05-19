import { Logger } from 'tslog'

let logLevel = (() => {
    if (process.argv.includes('--quiet')) {
        return 0
    }
    if (process.argv.includes('--verbose')) {
        return 5
    }
    return 4
})()
const logger = new Logger<void>({ minLevel: logLevel })

export function setLogLevel(level: 'quiet' | 'verbose' | 'normal') {
    switch (level) {
        case 'quiet':
            logLevel = 5
            break
        case 'verbose':
            logLevel = 0
            break
        case 'normal':
            logLevel = 4
            break
    }
    logger.settings.minLevel = logLevel
}

export default function getLogger(name: string) {
    return logger.getSubLogger({ name, minLevel: logLevel })
}
