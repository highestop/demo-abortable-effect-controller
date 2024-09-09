import { AbortableEffectController } from '../core/abortable-effect-controller'

export function fetchWithController(
    id: string,
    request: RequestInfo,
    controller: AbortableEffectController
): Promise<Response> {
    const abortController = new AbortController()
    controller.onCleanup(() => abortController.abort())
    return fetch(request, { signal: abortController.signal })
}
