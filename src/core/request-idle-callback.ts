import { EffectCleanupController } from "./effect-cleanup-controller"

/**
 * Wrap requestIdleCallback with an abort signal.
 * @param callback
 * @param signal
 */
export function wrapRequestIdleCallbackWithSignal(
    callback: () => void,
    signal: AbortSignal
) {
    // check if it's safe to create a new async task
    EffectCleanupController.assertCanCreateAsyncTask('requestIdleCallback with signal')

    // create a new requestIdleCallback
    const ric = requestIdleCallback(callback)

    // add an event listener to cancel the requestIdleCallback when the signal is aborted
    const cleanup = () => {
        cancelIdleCallback(ric)
        signal.removeEventListener('abort', cleanup)
    }
    signal.addEventListener('abort', cleanup)
}
