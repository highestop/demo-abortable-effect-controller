import { AbortableEffectController } from '../core/abortable-effect-controller'

export function queueMicrotaskWithController<T>(
    callback: () => void,
    controller: AbortableEffectController
): void {
    queueMicrotask(() => {
        if (controller.abortSignal.aborted) {
            if (process.env.NODE_ENV !== 'production') {
                console.log(
                    `Microtask is aborted in Controller (${controller.id}).`
                )
            }
            return
        }
        callback()
    })
}
