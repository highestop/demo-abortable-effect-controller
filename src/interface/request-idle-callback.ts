import { AbortableEffectController } from '../core/abortable-effect-controller'

export function requestIdleCallbackWithController(
    callback: () => void,
    controller: AbortableEffectController
): void {
    const ric = requestIdleCallback(callback)
    const cleanup = () => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(
                `AnimationFrame is aborted in Controller (${controller.id}).`
            )
        }

        cancelIdleCallback(ric)
        controller.abortSignal.removeEventListener('abort', cleanup)
    }
    controller.abortSignal.addEventListener('abort', cleanup)
}
