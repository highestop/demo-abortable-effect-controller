import { AbortableEffectController } from '../core/abortable-effect-controller'

export function requestAnimationFrameWithController(
    callback: FrameRequestCallback,
    controller: AbortableEffectController
): void {
    const raf = requestAnimationFrame(callback)
    const cleanup = () => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(
                `AnimationFrame is aborted in Controller (${controller.id}).`
            )
        }

        cancelAnimationFrame(raf)
        controller.abortSignal.removeEventListener('abort', cleanup)
    }
    controller.abortSignal.addEventListener('abort', cleanup)
}
