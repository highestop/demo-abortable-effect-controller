import { AsyncTaskController } from './async-task-controller'
import { IDestroyController, DestroyController } from './destroy-controller'

type AsyncTaskExecutor<T> = (
    resolve: (value: T | PromiseLike<T> | AsyncTask<T>) => void,
    reject: (reason?: any) => any,
    abortSignal: AbortSignal,
    onDestroy: (callback: () => void) => void
) => void
export class AsyncTask<T = void> extends Promise<T> {
    constructor(
        executor: AsyncTaskExecutor<T>,
        controller: IDestroyController = new DestroyController()
    ) {
        AsyncTaskController.assertEnabled()
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
                controller.onDestroy
            )
        })
    }
}
