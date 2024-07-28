import { AsyncTaskController } from './async-task-controller'

/**
 *
 * @param callback
 * @param signal
 */
export function wrapRequestIdleCallbackWithSignal(
    callback: () => void,
    signal: AbortSignal
) {
    AsyncTaskController.assertEnabled('requestIdleCallback with signal')
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
