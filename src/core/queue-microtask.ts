import { AsyncTaskController } from './async-task-controller'

/**
 *
 * @param callback
 * @param signal
 */
export function wrapQueueMicrotaskWithSignal<T>(
    callback: () => Promise<T>,
    signal: AbortSignal
) {
    AsyncTaskController.assertEnabled('queueMicrotask with signal')
    queueMicrotask(() => {
        if (!signal.aborted) {
            callback()
        }
    })
}
