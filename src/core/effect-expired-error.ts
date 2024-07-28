const EFFECT_EXPIRED_ERROR_NAME = 'EffectExpiredError'

export function generateEffectExpiredError(reason?: string) {
    return new Error(
        reason ? `${EFFECT_EXPIRED_ERROR_NAME}: ${reason}` : EFFECT_EXPIRED_ERROR_NAME
    )
}

export function isEffectExpiredError(error: string | Error) {
    return error instanceof Error
        ? error.message.startsWith(EFFECT_EXPIRED_ERROR_NAME)
        : typeof error === 'string' && error.startsWith(EFFECT_EXPIRED_ERROR_NAME)
}
