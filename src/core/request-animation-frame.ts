import { EffectController } from './effect-controller'

export function requestAnimationFrameWithController(
    callback: FrameRequestCallback,
    controller: EffectController = new EffectController()
) {
    EffectController.assertCanCreateAsyncTask('RequestAnimationFrame')
    controller.assertCanCreateAsyncTask('RequestAnimationFrame')

    const raf = requestAnimationFrame(callback)
    const cleanup = () => {
        cancelAnimationFrame(raf)
        controller.abortSignal.removeEventListener('abort', cleanup)
    }
    controller.abortSignal.addEventListener('abort', cleanup)

    return controller
}
