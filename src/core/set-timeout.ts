import { EffectCleanupController } from "./effect-cleanup-controller"

/**
 * Wrap setTimeout with an abort signal.
 * @param callback
 * @param timeout
 * @param signal
 */
export function wrapTimeoutWithSignal(
    callback: () => void,
    timeout: number,
    signal: AbortSignal
) {
    // check if it's safe to create a new async task
    EffectCleanupController.assertCanCreateAsyncTask('setTimeout with signal')

    // create a new setTimeout
    const sto = setTimeout(callback, timeout)

    // add an event listener to cancel the setTimeout when the signal is aborted
    const cleanup = () => {
        clearTimeout(sto)
        signal.removeEventListener('abort', cleanup)
    }
    signal.addEventListener('abort', cleanup)

    // return the setTimeout id
    return sto
}
