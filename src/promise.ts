import { AsyncTask } from './async-task'
import { AsyncTaskController } from './async-task-controller'
import { IDestroyController } from './destroy-controller'

/**
 *
 * @param promise
 * @param controller
 * @returns
 */
export function promiseToAsyncTask<T>(
    promise: Promise<T>,
    controller: IDestroyController
) {
    AsyncTaskController.assertEnabled('create async task from promise')
    return new AsyncTask<T>(async (resolve, reject, signal) => {
        try {
            const ret = await promise
            if (signal.aborted) {
                reject('AbortError')
                return
            }
            resolve(ret)
        } catch (e) {
            reject(e)
        }
    }, controller)
}
