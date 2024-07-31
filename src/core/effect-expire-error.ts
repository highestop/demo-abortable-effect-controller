export const EffectExpireError = 'EffectExpireError'

export function isEffectExpireError(error: string | Error) {
    return error instanceof Error
        ? error.message.startsWith(EffectExpireError)
        : typeof error === 'string' && error.startsWith(EffectExpireError)
}
