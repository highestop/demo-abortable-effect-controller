export const isDev = process.env.NODE_ENV !== 'production'

export function devLog(...args: any[]) {
    if (isDev) {
        console.log(...args)
    }
}

export function errorMessage(title: string, description?: string) {
    return [title, description && `(${description})`].join(' ')
}
