import { AbortableEffectController } from '../core/abortable-effect-controller'

export function fetchWithController(
    id: string,
    request: RequestInfo,
    controller: AbortableEffectController
): Promise<Response> {
    return fetch(request, { signal: controller.abortSignal })
}
