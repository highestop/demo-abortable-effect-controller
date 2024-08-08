const AbortErrorPrefix = 'AbortError'

export function isAbortError(error: any) {
    return error instanceof AbortError && error.name === AbortErrorPrefix
}

export class AbortError extends Error {
    constructor(reason?: string) {
        super(reason)
        this.name = AbortErrorPrefix
    }
}
