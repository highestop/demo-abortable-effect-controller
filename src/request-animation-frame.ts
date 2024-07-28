import { AsyncTaskController } from './async-task-controller'

/**
 *
 * @param callback
 * @param signal
 * @returns
 */
export function wrapRequestAnimationFrameWithSignal(
    callback: FrameRequestCallback,
    signal: AbortSignal
) {
    AsyncTaskController.assertEnabled('requestAnimationFrame with signal')
    // const raf = requestAnimationFrame((time: DOMHighResTimeStamp) => {
    //     if (!signal.aborted) {
    //         callback(time)
    //     }
    //     cancelAnimationFrame(raf)
    // })
    const raf = requestAnimationFrame(callback)
    const listener = () => {
        cancelAnimationFrame(raf)
        signal.removeEventListener('abort', listener)
    }
    signal.addEventListener('abort', listener)
    return raf
}
