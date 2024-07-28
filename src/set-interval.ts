/**
 *
 * @param callback
 * @param interval
 * @param signal
 */
export function wrapIntervalWithSingal(
    callback: () => void,
    interval: number,
    signal: AbortSignal
) {
    // const stv = setInterval(() => {
    //     if (!signal.aborted) {
    //         callback()
    //     } else {
    //         clearInterval(stv)
    //     }
    // }, interval)
    const stv = setInterval(callback, interval)
    const listener = () => {
        clearInterval(stv)
        signal.removeEventListener('abort', listener)
    }
    signal.addEventListener('abort', listener)
    return stv
}
