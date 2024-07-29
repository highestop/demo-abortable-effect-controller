import { EffectCleanupController } from "./effect-cleanup-controller"

/**
 * Wrap setInterval with an abort signal.
 * @param callback
 * @param interval
 * @param signal
 */
export function wrapIntervalWithSingal(
    callback: () => void,
    interval: number,
    signal: AbortSignal
) {
    EffectCleanupController.assertCanCreateAsyncTask('setInterval with signal')

    // create a new setInterval
    const stv = setInterval(callback, interval)

    // add an event listener to cancel the setInterval when the signal is aborted
    const cleanup = () => {
        clearInterval(stv)
        signal.removeEventListener('abort', cleanup)
    }
    signal.addEventListener('abort', cleanup)

    // return the setInterval id
    return stv
}
