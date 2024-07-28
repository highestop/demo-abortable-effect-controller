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
