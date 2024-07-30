export interface IEffectCleanupController {
    abortSignal: AbortSignal
    cleanupOnDestroyed(callback: () => void): void
    destroy(reason?: string): void
}

export class EffectCleanupController implements IEffectCleanupController {
    constructor(private readonly name?: string) {
        if (process.env.NODE_ENV === 'development') {
            console.log('[controller create]', this.name)
        }
    }

    private abortController = new AbortController()
    get abortSignal() {
        return this.abortController.signal
    }

    cleanupOnDestroyed = (cleanupCallback: () => void) => {
        // if the controller is already aborted, do the cleanup immediately
        if (this.abortController.signal.aborted) {
            cleanupCallback()
            return
        }
        // otherwise, listen to the abort event to cleanup and remove listener itself
        const cleanupListener = () => {
            cleanupCallback()
            this.abortSignal.removeEventListener('abort', cleanupListener)
        }
        this.abortSignal.addEventListener('abort', cleanupListener)
    }

    // create a child controller inherit the cleanup behavior
    createChildController(name?: string) {
        const controller = new EffectCleanupController(name)
        this.cleanupOnDestroyed(() => {
            controller.destroy()
        })
        return controller
    }

    destroy(reason?: string) {
        if (process.env.NODE_ENV === 'development') {
            console.log('[controller cleanup]', this.name)
        }

        // set a flag to prevent creating new async tasks during cleaning-up
        EffectCleanupController.isCleaning = true
        // abort the controller to trigger all cleanup listeners
        this.abortController.abort(reason)
        // reset the flag
        EffectCleanupController.isCleaning = false
    }

    private static isCleaning = false

    // assert if it's safe to create a new async task
    static assertCanCreateAsyncTask(description?: string) {
        if (!this.isCleaning) {
            throw new Error(
                [
                    'Cannot create any AsyncTask during cleaning-up',
                    description && `(${description})`,
                ].join(' ')
            )
        }
        return true
    }
}
