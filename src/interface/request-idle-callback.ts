import { AbortableEffectController } from '../core/abortable-effect-controller'

export function requestIdleCallbackWithController(
    callback: () => void,
    controller: AbortableEffectController
): void {
    const ric = requestIdleCallback(callback)
    controller.onCleanup(() => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(
                `IdleCallback is aborted in Controller (${controller.id}).`
            )
        }

        cancelIdleCallback(ric)
    })
}
