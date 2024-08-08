import { useEffect } from 'react'
import { AbortableEffectController } from '../core/abortable-effect-controller'

/**
 *
 * @param setup
 * @param options
 */
export function useEffectController(
    setup: (controller: AbortableEffectController) => any,
    options?: { controllerId?: string; cleanupReason?: string }
) {
    useEffect(() => {
        const controller = new AbortableEffectController(options?.controllerId)
        setup(controller)
        return () => {
            controller.destroy(options?.cleanupReason)
        }
    }, [])
}
