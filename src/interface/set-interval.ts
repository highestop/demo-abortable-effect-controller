import { AbortableEffectController } from '../core/abortable-effect-controller'

export function setIntervalWithController(
    callback: () => void,
    interval: number,
    controller: AbortableEffectController
): void {
    const stv = setInterval(callback, interval)
    const cleanup = () => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Interval is aborted in Controller (${controller.id}).`)
        }

        clearInterval(stv)
        controller.abortSignal.removeEventListener('abort', cleanup)
    }
    controller.abortSignal.addEventListener('abort', cleanup)
}
