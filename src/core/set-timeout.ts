import { EffectController } from './effect-controller'

export function setTimeoutWithController(
    callback: () => void,
    timeout: number,
    controller: EffectController = new EffectController()
) {
    EffectController.assertCanCreateAsyncTask('Timeout')
    controller.assertCanCreateAsyncTask('Timeout')

    const sto = setTimeout(callback, timeout)
    const cleanup = () => {
        clearTimeout(sto)
        controller.abortSignal.removeEventListener('abort', cleanup)
    }
    controller.abortSignal.addEventListener('abort', cleanup)

    return controller
}
