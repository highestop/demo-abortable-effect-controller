export interface IEffectCleanupController {
    abortSignal: AbortSignal
    onCleanup(callback: () => void): void
}

export class EffectCleanupController implements IEffectCleanupController {
    constructor(private readonly name?: string) {
        if (process.env.NODE_ENV === 'development') {
            console.log('[controller create]', this.name)
        }
    }

    // AbortController instance
    private abortController = new AbortController()
    // AbortSignal instance
    get abortSignal() {
        return this.abortController.signal
    }

    onCleanup = (cleanupCallback: () => void) => {
        // if the controller is already aborted, cleanup immediately
        if (this.abortController.signal.aborted) {
            cleanupCallback()
            return
        }
        // otherwise, listen to the abort event to cleanup and remove listener itself
        const cleanup = () => {
            cleanupCallback()
            this.abortSignal.removeEventListener('abort', cleanup)
        }
        this.abortSignal.addEventListener('abort', cleanup)
    }

    cleanup(reason?: string) {
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

    // static method to assert if it's safe to create a new async task
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
