import { EffectController } from './effect-controller'
import { AbortErrorPrefix } from './abort-error'
import { composeMessage } from './util'

type PromiseWithControllerExecutor<T> = (
    resolve: (value: T | PromiseLike<T> | PromiseWithController<T>) => void,
    reject: (reason?: any) => any,
    controller: EffectController
) => void

export class PromiseWithController<T = void> extends Promise<T> {
    constructor(
        executor: PromiseWithControllerExecutor<T>,
        controller: EffectController = new EffectController()
    ) {
        controller.assertCanCreateAsyncTask('AsyncTask')

        super((resolve, reject) => {
            executor(resolve, reject, controller)
        })
    }
}

export function promiseWithController<T>(
    promiseLike: Promise<T>,
    controller: EffectController
)
export function promiseWithController<T>(
    promiseLike: PromiseWithController<T>,
    controller: EffectController
)
export function promiseWithController<T>(
    promiseLike: Promise<T> | PromiseWithControllerExecutor<T>,
    controller: EffectController = new EffectController()
) {
    controller.assertCanCreateAsyncTask('Promise')

    if (promiseLike instanceof Promise) {
        const promise = new PromiseWithController<T>(
            async (_resolve, _reject, _controller) => {
                try {
                    const ret = await promiseLike

                    if (_controller.abortSignal.aborted) {
                        _reject(
                            new Error(
                                composeMessage(
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
