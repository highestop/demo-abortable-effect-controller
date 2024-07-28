import { AsyncTaskController } from './async-task-controller'

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
    AsyncTaskController.assertEnabled('setInterval with signal')
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
