import { EffectCleanupController } from "./effect-cleanup-controller"

/**
 *
 * @param callback
 * @param timeout
 * @param signal
 */
export function wrapTimeoutWithSignal(
    callback: () => void,
    timeout: number,
    signal: AbortSignal
) {
    EffectCleanupController.assertCanCreateAsyncTask('setTimeout with signal')
    // const sto = setTimeout(() => {
    //     if (!signal.aborted) {
    //         callback()
    //     }
    //     clearTimeout(sto)
    // }, timeout)
    const sto = setTimeout(callback, timeout)
    const listener = () => {
        clearTimeout(sto)
        signal.removeEventListener('abort', listener)
    }
    signal.addEventListener('abort', listener)
    return sto
}
