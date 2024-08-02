import { EffectController } from '../core/effect-controller'

export function setTimeoutWithController(
    id: string,
    callback: () => void,
    timeout: number,
    parentController: EffectController
): [ReturnType<typeof setTimeout>, EffectController] {
    const controller = parentController.createChildController(id)
    const sto = setTimeout(callback, timeout)
    const cleanup = () => {
        clearTimeout(sto)
        controller.abortSignal.removeEventListener('abort', cleanup)
    }
    controller.abortSignal.addEventListener('abort', cleanup)
    return [sto, controller]
}
