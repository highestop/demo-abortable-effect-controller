import { TracableAbortController } from '../impl'

export function requestAnimationFrameWithController(
    callback: FrameRequestCallback,
    controller: TracableAbortController
): void {
    const raf = requestAnimationFrame(callback)
    controller.onCleanup(() => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(
                `AnimationFrame is aborted in Controller (${controller.id}).`
            )
        }
        cancelAnimationFrame(raf)
    })
}
