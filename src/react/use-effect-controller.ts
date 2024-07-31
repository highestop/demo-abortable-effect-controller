import { DependencyList, useEffect } from 'react'
import { EffectController } from '../core/effect-controller'

/**
 *
 * @param setup
 * @param deps
 * @param options
 */
export function useEffectController(
    setup: (controller: EffectController) => any,
    deps: DependencyList,
    options?: { controllerName?: string; cleanupReason?: string }
) {
    useEffect(() => {
        const controller = new EffectController(options?.controllerName)
        setup(controller)
        return () => {
            controller.destroy(options?.cleanupReason)
        }
    }, deps)
}
