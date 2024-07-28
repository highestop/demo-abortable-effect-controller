import { IEffectCleanupController, EffectCleanupController } from './effect-cleanup-controller'

type AsyncTaskExecutor<T> = (
    resolve: (value: T | PromiseLike<T> | AsyncTask<T>) => void,
    reject: (reason?: any) => any,
    abortSignal: AbortSignal,
    onCleanup: (callback: () => void) => void
) => void
export class AsyncTask<T = void> extends Promise<T> {
    constructor(
        executor: AsyncTaskExecutor<T>,
        controller: IEffectCleanupController = new EffectCleanupController()
    ) {
        EffectCleanupController.assertCanCreateAsyncTask()
        if (controller.abortSignal.aborted) {
            throw new Error(
                'Cannot attach task to an already aborted controller.'
            )
        }
        super((resolve, reject) => {
            executor(
                resolve,
                reject,
                controller.abortSignal,
                controller.onCleanup
            )
        })
    }
}
