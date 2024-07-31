import { AsyncTask } from './async-task'
import { EffectController } from './effect-controller'
import { EffectExpireError } from './effect-expire-error'
import { errorMessage } from './util'

export function promiseWithController<T>(
    promise: Promise<T>,
    controller: EffectController = new EffectController()
) {
    EffectController.assertCanCreateAsyncTask('Promise')
    controller.assertCanCreateAsyncTask('Promise')

    const _promise = new AsyncTask<T>(
        async (_resolve, _reject, _controller) => {
            try {
                const ret = await promise

                if (_controller.abortSignal.aborted) {
                    _reject(
                        new Error(
                            errorMessage(
                                EffectExpireError,
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

    return [_promise, controller]
}
