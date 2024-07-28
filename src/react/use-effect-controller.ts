import { DependencyList, useEffect } from 'react'
import { EffectCleanupController, IEffectCleanupController } from '../core/effect-cleanup-controller'

export function useEffectController(
    setup: (controller: IEffectCleanupController) => any,
    deps: DependencyList,
    options?: { name?: string, reason?: string }
) {
    useEffect(() => {
        const controller = new EffectCleanupController(options?.name)
        setup(controller)
        return () => {
            controller.cleanup(options?.reason)
        }
    }, deps)
}
