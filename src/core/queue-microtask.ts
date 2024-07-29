import { EffectCleanupController } from "./effect-cleanup-controller"

/**
 * Wrap queueMicrotask with an abort signal.
 * @param callback
 * @param signal
 */
export function wrapQueueMicrotaskWithSignal<T>(
    callback: () => Promise<T>,
    signal: AbortSignal
) {
    // check if it's safe to create a new async task
    EffectCleanupController.assertCanCreateAsyncTask('queueMicrotask with signal')

    // call queueMicrotask with the signal inside to prevent the callback from being executed after aborting
    queueMicrotask(() => {
        if (!signal.aborted) {
            callback()
        }
    })
}
