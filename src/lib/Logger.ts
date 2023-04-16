import {Logger} from 'tslog'

let logLevel = (() => {
    if (process.argv.includes('--quiet')) {
        return 0
    }
    if (process.argv.includes('--verbose')) {
        return 5
    }
    return 3
})()

export function setLogLevel(level: 'quiet' | 'verbose' | 'normal') {
    switch (level) {
        case 'quiet':
            logLevel = 5
            break
        case 'verbose':
            logLevel = 0
            break
        case 'normal':
            logLevel = 3
            break
    }
}

export default function getLogger(name: string) {
    return new Logger<void>({name, minLevel: logLevel})
}