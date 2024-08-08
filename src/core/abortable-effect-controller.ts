type CleanupCallback = (reason?: string) => void

class AbortableEffectControllerError extends Error {
    constructor(description: string, id?: string) {
        super(description)
        this.name = 'AbortableEffectControllerError'
        this.message = `[${id}] ${description}`
    }
}

export class AbortableEffectController {
    constructor(private readonly _id?: string) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Create Controller (${this.id})`)
        }
    }
    get id() {
        return this._id ?? '-'
    }

    private abortController = new AbortController()
    get abortSignal() {
        return this.abortController.signal
    }

    onCleanup = (cleanupCallback: CleanupCallback) => {
        // 如果已经被销毁，直接抛出异常，不允许再追加清理工作
        if (this.abortSignal.aborted) {
            throw new AbortableEffectControllerError(
                'Cannot attach cleanup callback to an already destroyed controller.',
                this.id
            )
        }

        const cleanupListener = () => {
            cleanupCallback(this.abortSignal.reason)
            // 这里保证 cleanupCallback 只会被调用一次且不会导致内存泄漏
            this.abortSignal.removeEventListener('abort', cleanupListener)
        }
        this.abortSignal.addEventListener('abort', cleanupListener)
    }

    destroy(reason?: string) {
        // 如果已经被销毁，直接抛出异常，只允许销毁一次
        if (this.abortSignal.aborted) {
            throw new AbortableEffectControllerError(
                'Cannot destroy an already destroyed controller.',
                this.id
            )
        }

        // 在执行 abort 之前先打印 log 标记开始销毁
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Destroy Controller (${this.id})`)
        }

        this.abortController.abort(reason)
    }

    createChildController(id?: string) {
        // 如果已经被销毁，直接抛出异常，不允许再创建子控制器
        if (this.abortSignal.aborted) {
            throw new AbortableEffectControllerError(
                'Cannot create child controller to an already destroyed controller.',
                this.id
            )
        }
        const controller = new AbortableEffectController(id)

        // 子控制器会随着复制父控制器的销毁事件
        this.onCleanup(() => {
            // 但允许子控制器自行销毁，这里是为了不会因为重复销毁子容器而抛出异常
            if (controller.abortSignal.aborted) {
                return
            }
            controller.destroy()
        })

        return controller
    }
}
