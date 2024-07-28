/**
 *
 * @param callback
 * @param signal
 */
export function wrapRequestIdleCallbackWithSignal(
    callback: () => void,
    signal: AbortSignal
) {
    // const ric = requestIdleCallback(() => {
    //     if (!signal.aborted) {
    //         callback()
    //     }
    //     cancelIdleCallback(ric)
    // })
    const ric = requestIdleCallback(callback)
    const listener = () => {
        cancelIdleCallback(ric)
        signal.removeEventListener('abort', listener)
    }
    signal.addEventListener('abort', listener)
}
