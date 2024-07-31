import { EffectController } from './effect-controller'

export function queueMicrotaskWithController<T>(
    callback: () => Promise<T> | PromiseLike<T>,
    controller: EffectController = new EffectController()
) {
    EffectController.assertCanCreateAsyncTask('Microtask')
    controller.assertCanCreateAsyncTask('Microtask')

    queueMicrotask(() => {
        if (!controller.abortSignal.aborted) {
            callback()
        }
    })

    return controller
}
