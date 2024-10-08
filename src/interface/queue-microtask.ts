import { TracableAbortController } from '../impl'
import { safeCall } from './safe-call'

export function queueMicrotaskWithController(
    callback: () => void,
    controller: TracableAbortController
): void {
    queueMicrotask(() => {
        safeCall(callback, controller, 'Microtask')
    })
}
