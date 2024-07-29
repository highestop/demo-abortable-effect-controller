import { AsyncTask } from './async-task'
import { EffectCleanupController, IEffectCleanupController } from './effect-cleanup-controller'
import { generateEffectExpiredError } from './effect-expired-error'

/**
 * Convert a promise to an async task.
 * @param promise
 * @param controller
 * @returns
 */
export function promiseToAsyncTask<T>(
    promise: Promise<T>,
    controller: IEffectCleanupController
) {
    // check if it's safe to create a new async task
    EffectCleanupController.assertCanCreateAsyncTask('create async task from promise')

    // return a new async task that wraps the promise
    return new AsyncTask<T>(async (resolve, reject, signal) => {
        try {
            const ret = await promise

            // if the controller is already aborted, reject the task with expired error
            if (signal.aborted) {
                reject(generateEffectExpiredError(signal.reason))
                return
            }

            // otherwise, resolve the task with the result
            resolve(ret)
        } catch (e) {
            reject(e)
        }
    }, controller)
}
