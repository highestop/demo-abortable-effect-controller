export interface IEffectController {
    abortSignal: AbortSignal
    onCleanup(callback: () => void): void
}

export class EffectController implements IEffectController {
    constructor(private readonly name?: string) {
        // @ts-ignore
        if (process.env.NODE_ENV === 'development') {
            console.log('create controller:', this.name)
        }
    }
    private abortController = new AbortController()
    get abortSignal() {
        return this.abortController.signal
    }
    private cleanupCallbacks: (() => void)[] = []
    onCleanup = (listener: () => void) => {
        this.cleanupCallbacks.push(listener)
    }
    private cleanup = () => {
        this.cleanupCallbacks.forEach((listener) => {
            try {
                listener()
            } catch {}
        })
        this.cleanupCallbacks.length = 0
    }
    destroy() {
        this.abortController.abort()
        this.cleanup()
    }
}
