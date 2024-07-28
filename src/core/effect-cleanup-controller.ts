export interface IEffectCleanupController {
    abortSignal: AbortSignal
    onCleanup(callback: () => void): void
}

export class EffectCleanupController implements IEffectCleanupController {
    constructor(private readonly name?: string) {
        if (process.env.NODE_ENV === 'development') {
            console.log('create effect controller:', this.name)
        }
    }

    //

    private abortController = new AbortController()
    get abortSignal() {
        return this.abortController.signal
    }
    onCleanup = (cleanupCallback: () => void) => {
        const cleanup = () => {
            cleanupCallback()
            this.abortSignal.removeEventListener('abort', cleanup)
        }
        this.abortSignal.addEventListener('abort', cleanup)
    }
    cleanup(reason?: string) {
        EffectCleanupController.isCleaning = true
        this.abortController.abort(reason)
        EffectCleanupController.isCleaning = false
    }

    //

    private static isCleaning = false
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
