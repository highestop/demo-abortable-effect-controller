import { TracableAbortController } from '../impl'

export function fetchWithController(
    request: RequestInfo,
    controller: TracableAbortController
): Promise<Response> {
    const abortController = new AbortController()
    controller.onCleanup(() => abortController.abort())
    return fetch(request, { signal: abortController.signal })
}
