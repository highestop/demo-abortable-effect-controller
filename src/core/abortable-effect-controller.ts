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
            if (!controller.destroyed) {
                throw new AbortableEffectControllerError(
                    'Controller is not aborted.',
                    controller.id
                )
            }
            if (controller.cleanupCallbacks.length) {
                throw new AbortableEffectControllerError(
                    'Controller still has cleanup callbacks.',
                    controller.id
                )
            }
        }
        // 清理所有 controller 持有以释放内存
        this._controllerMap.clear()
    }

    readonly id: string
    constructor(id_?: string) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Create Controller (${this.id})`)
        }
        // 每个 controller 有一个唯一 id
        this.id = `${AbortableEffectController._controllerId++}:${id_ ?? '-'}`
        // 静态变量持有所有 controller 的映射关系
        if (AbortableEffectController._controllerMap.has(this.id)) {
            throw new AbortableEffectControllerError(
                'Controller id duplicated',
                this.id
            )
        }
        AbortableEffectController._controllerMap.set(this.id, this)
    }

    private _destroyed: { status: false } | { status: true; reason?: string } =
        { status: false }
    private _destroy(reason?: string) {
        this._destroyed = {
            status: true,
            reason,
        }
    }
    get destroyed() {
        return !!this._destroyed.status
    }
    // 得是个有序的列表，在 cleanup 时要反序要清理
    private cleanupCallbacks: CleanupCallback[] = []

    onCleanup = (cleanupCallback: CleanupCallback) => {
        // 如果已经被销毁，直接抛出异常，不允许再追加清理工作
        if (this.destroyed) {
            throw new AbortableEffectControllerError(
                'Cannot attach cleanup callback to an already destroyed controller.',
                this.id
            )
        }
        this.cleanupCallbacks.push(cleanupCallback)
    }

    destroy(reason?: string) {
        // 如果已经被销毁，直接抛出异常，只允许销毁一次
        if (this.destroyed) {
            throw new AbortableEffectControllerError(
                'Cannot destroy an already destroyed controller.',
                this.id
            )
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log(`Destroy Controller (${this.id})`)
        }

        // 反序执行 cleanupCallbacks 并且清空列表
        while (this.cleanupCallbacks.length) {
            const cleanupCallback = this.cleanupCallbacks.pop()
            cleanupCallback?.(reason)
        }

        this._destroy(reason)
    }

    createChildController(id?: string) {
        // 父控制器已经被销毁，直接抛出异常，不允许再创建子控制器
        if (this.destroyed) {
            throw new AbortableEffectControllerError(
                'Cannot create child controller to an already destroyed controller.',
                this.id
            )
        }
        const childController = new AbortableEffectController(id)
        const safeDestroy = () => {
            // 允许子控制器自行销毁，这里是为了不会因为重复销毁子容器而抛出异常
            if (!childController.destroyed) {
                childController.destroy()
            }
        }
        // 子控制器会跟随父控制器一并销毁
        this.onCleanup(safeDestroy)

        return childController
    }
}
