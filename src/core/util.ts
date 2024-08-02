export function log(...args: any[]) {
    if (process.env.NODE_ENV !== 'production') {
        console.log(...args)
    }
}

export function tip(title: string, description?: string) {
    return [title, description && `(${description})`].join(' ')
}
