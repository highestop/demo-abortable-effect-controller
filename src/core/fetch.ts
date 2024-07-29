import { EffectCleanupController } from './effect-cleanup-controller'

/**
 * Wrap fetch with an abort signal.
 * @param request
 * @param signal
 * @returns
 */
export function wrapFetchWithSignal(request: RequestInfo, signal: AbortSignal) {
    // check if it's safe to create a new async task
    EffectCleanupController.assertCanCreateAsyncTask('fetch with signal')

    // create a new fetch request with the signal
    return fetch(request, { signal })
}
