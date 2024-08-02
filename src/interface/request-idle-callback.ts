import { EffectController } from '../core/effect-controller'

export function requestIdleCallbackWithController(
    id: string,
    callback: () => void,
    parentController: EffectController
): [number, EffectController] {
    const controller = parentController.createChildController(id)
    const ric = requestIdleCallback(callback)
    const cleanup = () => {
        cancelIdleCallback(ric)
        controller.abortSignal.removeEventListener('abort', cleanup)
    }
    controller.abortSignal.addEventListener('abort', cleanup)
    return [ric, controller]
}
