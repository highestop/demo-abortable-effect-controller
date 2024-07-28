/**
 *
 * @param request
 * @param signal
 * @returns
 */
export function wrapFetchWithSignal(request: RequestInfo, signal: AbortSignal) {
    return fetch(request, { signal })
}
