import { EffectController } from './effect-controller'

export function setIntervalWithController(
    callback: () => void,
    interval: number,
    controller: EffectController = new EffectController()
) {
    EffectController.assertCanCreateAsyncTask('Interval')
    controller.assertCanCreateAsyncTask('Interval')

    const stv = setInterval(callback, interval)
    const cleanup = () => {
        clearInterval(stv)
        controller.abortSignal.removeEventListener('abort', cleanup)
    }
    controller.abortSignal.addEventListener('abort', cleanup)

    return controller
}
