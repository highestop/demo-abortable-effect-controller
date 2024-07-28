import { DependencyList, useEffect } from 'react'
import {
    DestroyController,
    IDestroyController,
} from '../core/destroy-controller'

export function useDestroyed(
    processWithDestroyController: (controller: IDestroyController) => any,
    precessDeps: DependencyList,
    processName?: string
) {
    useEffect(() => {
        const controller = new DestroyController(processName)
        processWithDestroyController(controller)
        return () => {
            controller.destroy()
        }
    }, precessDeps)
}
