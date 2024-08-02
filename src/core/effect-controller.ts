import { traceLog, composeMessage } from './util'

export class EffectController {
    constructor(public readonly name?: string) {
        traceLog('[create controller]', this.name)
    }

    private abortController = new AbortController()
    get abortSignal() {
        return this.abortController.signal
    }

    onCleanup = (cleanupCallback: (reason?: string) => void) => {
        // 如果挂载时已经销毁，则会报错，不应该在销毁后再挂载任何清理函数
        if (this.abortSignal.aborted) {
            throw new Error(
                composeMessage(
                    'Cannot attach cleanup to an already destroyed controller.'
                )
            )
        }
        const cleanupListener = () => {
            cleanupCallback(this.abortSignal.reason)
            this.abortSignal.removeEventListener('abort', cleanupListener)
        }
        this.abortSignal.addEventListener('abort', cleanupListener)
    }

    // 创建一个会跟随自己销毁的子 controller
    createChildController(name?: string) {
        const controller = new EffectController(name)
        this.onCleanup(() => {
            // 子 controller 允许自己先销毁，所以父 controller 销毁时会检查并跳过
            if (controller.abortSignal.aborted) {
                return
            }
            controller.destroy()
        })
        return controller
    }

    destroy(reason?: string) {
        // 不应该重复销毁一个 controller 多次，如果重新开启一个流程，应该重建一个新的 controller
        if (this.abortSignal.aborted) {
            throw new Error(
                composeMessage(
                    'Cannot destroy an already destroyed controller.',
                    reason
                )
            )
        }

        traceLog('[destroy controller]', this.name, reason)
        this.abortController.abort(reason)
    }

    // 不能在已经 destroyed 的 controller 下创建新的异步任务
    assertCanCreateAsyncTask(reason?: string) {
        if (this.abortSignal.aborted) {
            throw new Error(
                composeMessage(
                    'Cannot attach async task to an already destroyed controller.',
                    reason
                )
            )
        }
    }
}
