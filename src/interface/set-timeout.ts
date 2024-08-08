import { AbortableEffectController } from '../core/abortable-effect-controller'

export function setTimeoutWithController(
    callback: () => void,
    timeout: number,
    controller: AbortableEffectController
): void {
    const sto = setTimeout(callback, timeout)
    const cleanup = () => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Timeout is aborted in Controller (${controller.id}).`)
        }

        clearTimeout(sto)
        controller.abortSignal.removeEventListener('abort', cleanup)
    }
    controller.abortSignal.addEventListener('abort', cleanup)
}
