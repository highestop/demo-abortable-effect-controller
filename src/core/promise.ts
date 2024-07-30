import { AsyncTask } from './async-task'
import { EffectCleanupController, IEffectCleanupController } from './effect-cleanup-controller'
import { generateEffectExpiredError } from './effect-expired-error'

/**
 * Convert a promise to an async task.
 * @param originalPromise
 * @param controller
 * @returns
 */
export function promiseToAsyncTask<T>(
    originalPromise: Promise<T>,
    parentController: IEffectCleanupController
) {
    // check if it's safe to create a new async task
    EffectCleanupController.assertCanCreateAsyncTask('create async task from promise')

    // return a new async task that wraps the promise
    return new AsyncTask<T>(async (resolve, reject, controller) => {
        try {
            const ret = await originalPromise

            // if the controller is already aborted, reject the task with expired error
            if (controller.abortSignal.aborted) {
                reject(generateEffectExpiredError(controller.abortSignal.reason))
                return
            }

            // otherwise, resolve the task with the result
            resolve(ret)
        } catch (e) {
            reject(e)
        }
    }, parentController)
}
