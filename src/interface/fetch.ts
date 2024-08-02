import { EffectController } from '../core/effect-controller'

export function fetchWithController(
    id: string,
    request: RequestInfo,
    parentController: EffectController
): [Promise<Response>, EffectController] {
    const controller = parentController.createChildController(id)
    return [fetch(request, { signal: controller.abortSignal }), controller]
}
