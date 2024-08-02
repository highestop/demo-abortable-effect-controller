import { EffectController } from './effect-controller'

export function queueMicrotaskWithController<T>(
    callback: () => Promise<T> | PromiseLike<T>,
    controller: EffectController = new EffectController()
) {
    controller.assertCanCreateAsyncTask('Microtask')

    queueMicrotask(() => {
        if (!controller.abortSignal.aborted) {
            callback()
        }
    })

    return [controller]
}
