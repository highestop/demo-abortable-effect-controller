import { AbortableEffectController } from '../core/abortable-effect-controller'
import { safeCall } from './safe-call'

export function queueMicrotaskWithController<T>(
    callback: () => void,
    controller: AbortableEffectController
): void {
    queueMicrotask(() => {
        safeCall(callback, controller, 'Microtask')
    })
}
