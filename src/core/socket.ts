import { EffectController } from './effect-controller'

export function createSocket(
    configs: {
        url: string | URL
        protocols?: string | string[]
    },
    controller: EffectController = new EffectController()
) {
    EffectController.assertCanCreateAsyncTask('WebSocket')
    controller.assertCanCreateAsyncTask('WebSocket')

    const socket = new WebSocket(configs.url, configs.protocols)
    controller.onDestroy(() => {
        socket.close()
    })

    return [socket, controller]
}
