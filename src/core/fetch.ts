import { EffectController } from './effect-controller'

export function fetchWithController(
    request: RequestInfo,
    controller: EffectController = new EffectController()
) {
    controller.assertCanCreateAsyncTask('Fetch')

    return [fetch(request, { signal: controller.abortSignal }), controller]
}
