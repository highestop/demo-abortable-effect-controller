import { AsyncTaskController } from './async-task-controller'

export interface IDestroyController {
    abortSignal: AbortSignal
    onDestroy(callback: () => void): void
}

export class DestroyController implements IDestroyController {
    constructor(private readonly name?: string) {
        if (process.env.NODE_ENV === 'development') {
            console.log('create controller:', this.name)
        }
    }
    private abortController = new AbortController()
    get abortSignal() {
        return this.abortController.signal
    }
    private destroyCallbacks: Set<() => void> = new Set()
    onDestroy = (destroyListener: () => void) => {
        this.destroyCallbacks.add(destroyListener)
        const destroy = () => {
            this.destroyCallbacks.delete(destroyListener)
            this.abortSignal.removeEventListener('abort', destroy)
        }
        this.abortSignal.addEventListener('abort', destroy)
    }
    destroy() {
        AsyncTaskController.disable()
        this.abortController.abort()
        this.destroyCallbacks.clear()
        AsyncTaskController.enable()
    }
}
