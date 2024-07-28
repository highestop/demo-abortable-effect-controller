import { AsyncTask } from './async-task'
import { EffectCleanupController, IEffectCleanupController } from './effect-cleanup-controller'
import { generateEffectExpiredError } from './effect-expired-error'

/**
 *
 * @param promise
 * @param controller
 * @returns
 */
export function promiseToAsyncTask<T>(
    promise: Promise<T>,
    controller: IEffectCleanupController
) {
    EffectCleanupController.assertCanCreateAsyncTask('create async task from promise')
    return new AsyncTask<T>(async (resolve, reject, signal) => {
        try {
            const ret = await promise
            if (signal.aborted) {
                reject(generateEffectExpiredError(signal.reason))
                return
            }
            resolve(ret)
        } catch (e) {
            reject(e)
        }
    }, controller)
}
