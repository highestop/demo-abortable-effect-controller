import { log, tip } from './util'

export class EffectController {
    constructor(public readonly id?: string) {
        log('+', this.id)
    }

    private abortController = new AbortController()
    get abortSignal() {
        return this.abortController.signal
    }

    onCleanup = (cleanupCallback: (reason?: string) => void) => {
        if (this.abortSignal.aborted) {
            throw new Error(
                tip(
                    'Cannot attach cleanup callback to an already destroyed controller.',
                    this.id
                )
            )
        }
        const cleanupListener = () => {
            cleanupCallback(this.abortSignal.reason)
            this.abortSignal.removeEventListener('abort', cleanupListener)
        }
        this.abortSignal.addEventListener('abort', cleanupListener)
    }

    destroy(reason?: string) {
        if (this.abortSignal.aborted) {
            throw new Error(
                tip('Cannot destroy an already destroyed controller.', this.id)
            )
        }
        log('-', this.id, reason)
        this.abortController.abort(reason)
    }

    createChildController(name?: string) {
        if (this.abortSignal.aborted) {
            throw new Error(
                tip(
                    'Cannot create child controller to an already destroyed controller.',
                    this.id
                )
            )
        }
        const controller = new EffectController(name)
        this.onCleanup(() => {
            if (controller.abortSignal.aborted) {
                return
            }
            controller.destroy()
        })
        return controller
    }
}
