import { DependencyList, useEffect } from 'react'
import { EffectCleanupController, IEffectCleanupController } from '../core/effect-cleanup-controller'

/**
 * 
 * @param setup 
 * @param deps 
 * @param options 
 */
export function useEffectController(
    setup: (controller: IEffectCleanupController) => any,
    deps: DependencyList,
    options?: { name?: string, reason?: string }
) {
    useEffect(() => {
        // create a new effect cleanup controller
        const controller = new EffectCleanupController(options?.name)

        // run the setup function with the controller
        setup(controller)

        // cleanup the controller when the effect is destroyed
        return () => {
            controller.cleanup(options?.reason)
        }
    }, deps)
}
