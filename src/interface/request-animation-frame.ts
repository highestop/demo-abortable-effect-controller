import { EffectController } from '../core/effect-controller'

export function requestAnimationFrameWithController(
    id: string,
    callback: FrameRequestCallback,
    parentController: EffectController
): [number, EffectController] {
    const controller = parentController.createChildController(id)
    const raf = requestAnimationFrame(callback)
    const cleanup = () => {
        cancelAnimationFrame(raf)
        controller.abortSignal.removeEventListener('abort', cleanup)
    }
    controller.abortSignal.addEventListener('abort', cleanup)
    return [raf, controller]
}
