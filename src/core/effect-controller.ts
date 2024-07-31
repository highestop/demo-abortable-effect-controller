import { devLog, errorMessage } from './util'

export class EffectController {
    constructor(public readonly name?: string) {
        devLog('[create controller]', this.name)
    }

    private abortController = new AbortController()
    get abortSignal() {
        return this.abortController.signal
    }

    onDestroy = (cleanupCallback: () => void) => {
        if (this.abortController.signal.aborted) {
            cleanupCallback()
            return
        }
        const cleanupListener = () => {
            cleanupCallback()
            this.abortSignal.removeEventListener('abort', cleanupListener)
        }
        this.abortSignal.addEventListener('abort', cleanupListener)
    }

    createChildController(name?: string) {
        const controller = new EffectController(name)
        this.onDestroy(() => {
            controller.destroy()
        })
        return controller
    }

    destroy(reason?: string) {
        devLog('[destroy controller]', this.name)

        EffectController.isCleaning = true
        {
            this.abortController.abort(reason)
        }
        EffectController.isCleaning = false
    }

    private static isCleaning = false
    static assertCanCreateAsyncTask(description?: string) {
        if (!EffectController.isCleaning) {
            throw new Error(
                errorMessage(
                    'Cannot create task during cleaning-up.',
                    description
                )
            )
        }
        return true
    }

    assertCanCreateAsyncTask(description?: string) {
        if (this.abortSignal.aborted) {
            throw new Error(
                errorMessage(
                    'Cannot attach to an already aborted controller.',
                    description
                )
            )
        }
    }
}
