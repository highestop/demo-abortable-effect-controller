const DESTROY_ERROR_NAME = 'DestroyError'

export function generateDestroyError(reason?: string) {
    return new Error(
        reason ? `${DESTROY_ERROR_NAME}: ${reason}` : DESTROY_ERROR_NAME
    )
}

export function isDestroyError(error: string | Error) {
    return error instanceof Error
        ? error.message.startsWith(DESTROY_ERROR_NAME)
        : typeof error === 'string' && error.startsWith(DESTROY_ERROR_NAME)
}
