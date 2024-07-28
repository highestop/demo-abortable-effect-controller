import { EffectCleanupController } from './effect-cleanup-controller'

/**
 *
 * @param request
 * @param signal
 * @returns
 */
export function wrapFetchWithSignal(request: RequestInfo, signal: AbortSignal) {
    EffectCleanupController.assertCanCreateAsyncTask('fetch with signal')
    return fetch(request, { signal })
}
