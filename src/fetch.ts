import { AsyncTaskController } from './async-task-controller'

/**
 *
 * @param request
 * @param signal
 * @returns
 */
export function wrapFetchWithSignal(request: RequestInfo, signal: AbortSignal) {
    AsyncTaskController.assertEnabled('fetch with signal')
    return fetch(request, { signal })
}
