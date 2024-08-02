import { EffectController } from '../core/effect-controller'

export function queueMicrotaskWithController<T>(
    id: string,
    callback: () => Promise<T> | PromiseLike<T>,
    parentController: EffectController
): [EffectController] {
    const controller = parentController.createChildController(id)
    queueMicrotask(() => {
        if (!controller.abortSignal.aborted) {
            callback()
        }
    })
    return [controller]
}
