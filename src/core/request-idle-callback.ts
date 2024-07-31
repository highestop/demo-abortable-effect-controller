import { EffectController } from './effect-controller'

export function requestIdleCallbackWithController(
    callback: () => void,
    controller: EffectController = new EffectController()
) {
    EffectController.assertCanCreateAsyncTask('RequestIdleCallback')
    controller.assertCanCreateAsyncTask('RequestIdleCallback')

    const ric = requestIdleCallback(callback)
    const cleanup = () => {
        cancelIdleCallback(ric)
        controller.abortSignal.removeEventListener('abort', cleanup)
    }
    controller.abortSignal.addEventListener('abort', cleanup)

    return controller
}
