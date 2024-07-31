import { EffectController } from './effect-controller'

export function fetchWithController(
    request: RequestInfo,
    controller: EffectController = new EffectController()
) {
    EffectController.assertCanCreateAsyncTask('Fetch')
    controller.assertCanCreateAsyncTask('Fetch')

    return [fetch(request, { signal: controller.abortSignal }), controller]
}
