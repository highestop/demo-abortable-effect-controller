import { useEffect } from 'react'
import { TracableAbortController } from '../impl'

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
