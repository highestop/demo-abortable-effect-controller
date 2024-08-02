export const AbortErrorPrefix = 'AbortError'

export function isAbortError(error: string | Error) {
    return error instanceof Error
        ? error.message.startsWith(AbortErrorPrefix)
        : typeof error === 'string' && error.startsWith(AbortErrorPrefix)
}
