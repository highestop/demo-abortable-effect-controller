import { useEffect } from 'react'
import { TracableAbortController } from '../core/tracable-abort-controller'

/**
 *
 * @param setup
 * @param options
 */
export function useController(
    setup: (controller: TracableAbortController) => any,
    options?: { controllerId?: string; cleanupReason?: string }
) {
    useEffect(() => {
        const controller = new TracableAbortController(options?.controllerId)
        setup(controller)
        return () => {
            controller.destroy(options?.cleanupReason)
        }
    }, [])
}
