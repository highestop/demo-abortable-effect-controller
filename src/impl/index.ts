type CleanupCallback = (reason?: string) => void

class TracableAbortControllerError extends Error {
    constructor(description: string, id?: string) {
        super(description)
        this.name = 'AbortError'
        this.message = `[${id}] ${description}`
    }
}

export class TracableAbortController {
    private static _controllerId = 0
    private static _controllerMap = new Map<string, TracableAbortController>()
    static controllerKeys() {
        return TracableAbortController._controllerMap.keys()
    }

    readonly id: string
    constructor(id_?: string) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Create Controller (${this.id})`)
        }
        
        this.id = `${TracableAbortController._controllerId++}:${id_ ?? '-'}`
        
        if (TracableAbortController._controllerMap.has(this.id)) {
            throw new TracableAbortControllerError(
                'Controller id duplicated',
                this.id
            )
        }
        TracableAbortController._controllerMap.set(this.id, this)
    }

    private _destroyed: { status: false } | { status: true; reason?: string } = { status: false }
    private _destroy(reason?: string) {
        this._destroyed = { status: true, reason }
        TracableAbortController._controllerMap.delete(this.id)
    }
    get destroyed() {
        return !!this._destroyed.status
    }

    private cleanupCallbacks: CleanupCallback[] = []
    onCleanup = (cleanupCallback: CleanupCallback) => {
        if (this.destroyed) {
            throw new TracableAbortControllerError(
                'Cannot attach cleanup callback to an already destroyed controller.',
                this.id
            )
        }
        this.cleanupCallbacks.push(cleanupCallback)
    }

    destroy(reason?: string) {
        if (this.destroyed) {
            throw new TracableAbortControllerError(
                'Cannot destroy an already destroyed controller.',
                this.id
            )
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log(`Destroy Controller (${this.id})`)
        }

        while (this.cleanupCallbacks.length) {
            const cleanupCallback = this.cleanupCallbacks.pop()
            cleanupCallback?.(reason)
        }

        this._destroy(reason)
    }

    createChildController(id?: string) {
        if (this.destroyed) {
            throw new TracableAbortControllerError(
                'Cannot create child controller to an already destroyed controller.',
                this.id
            )
        }
        const childController = new TracableAbortController(id)
        const safeDestroy = () => {
            if (!childController.destroyed) {
                childController.destroy()
            }
        }

        this.onCleanup(safeDestroy)

        return childController
    }
}
