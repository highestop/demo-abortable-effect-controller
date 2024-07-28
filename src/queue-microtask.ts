/**
 *
 * @param callback
 * @param signal
 */
export function wrapQueueMicrotaskWithSignal<T>(
    callback: () => Promise<T>,
    signal: AbortSignal
) {
    queueMicrotask(() => {
        if (!signal.aborted) {
            callback()
        }
    })
}
