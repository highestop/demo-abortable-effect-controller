import { IEffectCleanupController, EffectCleanupController } from './effect-cleanup-controller'

type AsyncTaskExecutor<T> = (
    resolve: (value: T | PromiseLike<T> | AsyncTask<T>) => void,
    reject: (reason?: any) => any,
    controller: IEffectCleanupController
) => void

export class AsyncTask<T = void> extends Promise<T> {
    constructor(
        executor: AsyncTaskExecutor<T>,
        controller: IEffectCleanupController = new EffectCleanupController()
    ) {
        // check if it's safe to create a new async task
        EffectCleanupController.assertCanCreateAsyncTask()

        // if the controller is already aborted, throw an error
        if (controller.abortSignal.aborted) {
            throw new Error(
                'Cannot attach task to an already aborted controller.'
            )
        }

        // call the parent constructor with the executor. provide abortSignal and onCleanup register
        super((resolve, reject) => {
            executor(
                resolve,
                reject,
                controller
            )
        })
    }
}
