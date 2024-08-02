export const isDev = process.env.NODE_ENV !== 'production'

export function traceLog(...args: any[]) {
    if (isDev) {
        console.log(...args)
    }
}

export function composeMessage(title: string, description?: string) {
    return [title, description && `(${description})`].join(' ')
}
