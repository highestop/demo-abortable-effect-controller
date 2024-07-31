import { EffectController } from './effect-controller'

type AsyncTaskExecutor<T> = (
    resolve: (value: T | PromiseLike<T> | AsyncTask<T>) => void,
    reject: (reason?: any) => any,
    controller: EffectController
) => void

export class AsyncTask<T = void> extends Promise<T> {
    constructor(
        executor: AsyncTaskExecutor<T>,
        controller: EffectController = new EffectController()
    ) {
        EffectController.assertCanCreateAsyncTask('AsyncTask')
        controller.assertCanCreateAsyncTask('AsyncTask')

        super((resolve, reject) => {
            executor(resolve, reject, controller)
        })
    }
}
