const EFFECT_CLEANED_UP_ERROR_NAME = 'EffectCleanedError'

/**
 * Generate an error that indicates that an effect has expired.
 * @param reason 
 * @returns
 */
export function generateEffectExpiredError(reason?: string) {
    return new Error(
        reason ? `${EFFECT_CLEANED_UP_ERROR_NAME}: ${reason}` : EFFECT_CLEANED_UP_ERROR_NAME
    )
}

/**
 * Check if an error is an effect expired error.
 * @param error 
 * @returns
 */
export function isEffectExpiredError(error: string | Error) {
    return error instanceof Error
        ? error.message.startsWith(EFFECT_CLEANED_UP_ERROR_NAME)
        : typeof error === 'string' && error.startsWith(EFFECT_CLEANED_UP_ERROR_NAME)
}
