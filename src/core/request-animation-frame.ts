import { EffectCleanupController } from "./effect-cleanup-controller"

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
    EffectCleanupController.assertCanCreateAsyncTask('requestAnimationFrame with signal')
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
