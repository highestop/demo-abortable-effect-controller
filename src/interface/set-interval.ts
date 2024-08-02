import { EffectController } from '../core/effect-controller'

export function setIntervalWithController(
    id: string,
    callback: () => void,
    interval: number,
    parentController: EffectController
): [ReturnType<typeof setInterval>, EffectController] {
    const controller = parentController.createChildController(id)
    const stv = setInterval(callback, interval)
    const cleanup = () => {
        clearInterval(stv)
        controller.abortSignal.removeEventListener('abort', cleanup)
    }
    controller.abortSignal.addEventListener('abort', cleanup)
    return [stv, controller]
}
