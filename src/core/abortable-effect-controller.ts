type CleanupCallback = (reason?: string) => void

class AbortableEffectControllerError extends Error {
    constructor(description: string, id?: string) {
        super(description)
        this.name = 'AbortableEffectControllerError'
        this.message = `[${id}] ${description}`
    }
}

export class AbortableEffectController {
    private static _controllerId = 0
    private static _controllerMap = new Map<string, AbortableEffectController>()

    static globalCleanup() {
        // 检查是否所有 controller 都被 abort 了，存在没有 abort 的就报错
        for (const controller of this._controllerMap.values()) {
            if (!controller.abortSignal.aborted) {
                throw new AbortableEffectControllerError(
                    'Controller is not aborted.',
                    controller.id
                )
            }
        }
        // 清理所有 controller 持有以释放内存
        this._controllerMap.clear()
    }

    private readonly id: string
    constructor(id_?: string) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Create Controller (${this.id})`)
        }
        // 每个 controller 有一个唯一 id
        this.id = `${AbortableEffectController._controllerId++}:${id_ ?? '-'}`
        // 静态变量持有所有 controller 的映射关系
        AbortableEffectController._controllerMap.set(this.id, this)
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

        this.abortSignal.addEventListener(
            'abort',
            () => cleanupCallback(this.abortSignal.reason),
            { once: true } // 这里保证 cleanupCallback 只会被调用一次且不会导致内存泄漏
        )
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
        // 父控制器已经被销毁，直接抛出异常，不允许再创建子控制器
        if (this.abortSignal.aborted) {
            throw new AbortableEffectControllerError(
                'Cannot create child controller to an already destroyed controller.',
                this.id
            )
        }
        const childController = new AbortableEffectController(id)
        const safeDestroy = () => {
            // 允许子控制器自行销毁，这里是为了不会因为重复销毁子容器而抛出异常
            if (!childController.abortSignal.aborted) {
                childController.destroy()
            }
        }
        // 子控制器会跟随父控制器一并销毁
        this.onCleanup(safeDestroy)

        return childController
    }
}
