import { EffectController } from '../core/effect-controller'
import { AbortErrorPrefix } from '../core/abort-error'
import { tip } from '../core/util'

type PromiseWithControllerExecutor<T> = (
    resolve: (value: T | PromiseLike<T> | PromiseWithController<T>) => void,
    reject: (reason?: any) => any,
    controller: EffectController
) => void

class PromiseWithController<T = void> extends Promise<T> {
    constructor(
        executor: PromiseWithControllerExecutor<T>,
        controller: EffectController
    ) {
        super((resolve, reject) => {
            executor(resolve, reject, controller)
        })
    }
}

export function promiseWithController<T>(
    id: string,
    promiseLike: Promise<T>,
    parentController: EffectController
): [PromiseWithController<T>, EffectController]
export function promiseWithController<T>(
    id: string,
    promiseLike: PromiseWithController<T>,
    parentController: EffectController
): [PromiseWithController<T>, EffectController]
export function promiseWithController<T>(
    id: string,
    promiseLike: Promise<T> | PromiseWithControllerExecutor<T>,
    parentController: EffectController
): [PromiseWithController<T>, EffectController] {
    const controller = parentController.createChildController(id)
    if (promiseLike instanceof Promise) {
        const promise = new PromiseWithController<T>(
            async (_resolve, _reject, _controller) => {
                try {
                    const ret = await promiseLike

                    if (_controller.abortSignal.aborted) {
                        _reject(
                            new Error(
                                tip(
                                    AbortErrorPrefix,
                                    _controller.abortSignal.reason
                                )
                            )
                        )
                        return
                    }

                    _resolve(ret)
                } catch (e) {
                    _reject(e)
                }
            },
            controller
        )
        return [promise, controller]
    } else {
        const promise = new PromiseWithController<T>(promiseLike, controller)
        return [promise, controller]
    }
}
