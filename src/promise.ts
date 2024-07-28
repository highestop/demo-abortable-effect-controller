import { AsyncTask } from './async-task'
import { IEffectController } from './effect-controller'

/**
 *
 * @param promise
 * @param controller
 * @returns
 */
export function promiseToAsyncTask<T>(
    promise: Promise<T>,
    controller: IEffectController
) {
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
