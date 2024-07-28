import { EffectCleanupController } from "./effect-cleanup-controller"

/**
 *
 * @param callback
 * @param signal
 */
export function wrapQueueMicrotaskWithSignal<T>(
    callback: () => Promise<T>,
    signal: AbortSignal
) {
    EffectCleanupController.assertCanCreateAsyncTask('queueMicrotask with signal')
    queueMicrotask(() => {
        if (!signal.aborted) {
            callback()
        }
    })
}
