import { EffectCleanupController } from "./effect-cleanup-controller"

/**
 * Wrap requestAnimationFrame with an abort signal.
 * @param callback
 * @param signal
 * @returns
 */
export function wrapRequestAnimationFrameWithSignal(
    callback: FrameRequestCallback,
    signal: AbortSignal
) {
    // check if it's safe to create a new async task
    EffectCleanupController.assertCanCreateAsyncTask('requestAnimationFrame with signal')

    // create a new requestAnimationFrame
    const raf = requestAnimationFrame(callback)

    // add an event listener to cancel the requestAnimationFrame when the signal is aborted
    const cleanup = () => {
        cancelAnimationFrame(raf)
        signal.removeEventListener('abort', cleanup)
    }
    signal.addEventListener('abort', cleanup)

    // return the requestAnimationFrame id
    return raf
}
