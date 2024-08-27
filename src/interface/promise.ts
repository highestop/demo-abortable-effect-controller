import { AbortError } from '../core/abort-error'
import { AbortableEffectController } from '../core/abortable-effect-controller'

type PromiseWithControllerExecutor<T> = (
    resolve: (value: T | PromiseLike<T> | PromiseWithController<T>) => void,
    reject: (reason?: any) => any
) => void

class PromiseWithController<T = void> extends Promise<T> {
    constructor(executor: PromiseWithControllerExecutor<T>) {
        super((resolve, reject) => {
            executor(resolve, reject)
        })
    }
}

export function promiseWithController<T>(
    promise: Promise<T>,
    controller: AbortableEffectController
): PromiseWithController<T>
export function promiseWithController<T>(
    promise: PromiseWithController<T>,
    controller: AbortableEffectController
): PromiseWithController<T>
export function promiseWithController<T>(
    promise: Promise<T> | PromiseWithControllerExecutor<T>,
    controller: AbortableEffectController
): PromiseWithController<T> {
    if (promise instanceof Promise) {
        return new PromiseWithController<T>(async (_resolve, _reject) => {
            const ret = await promise
            if (controller.abortSignal.aborted) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log(
                        `Promise is aborted in Controller (${controller.id}).`
                    )
                }

                _reject(new AbortError(controller.abortSignal.reason))
            } else {
                _resolve(ret)
            }
        })
    } else {
        return new PromiseWithController<T>(promise)
    }
}
