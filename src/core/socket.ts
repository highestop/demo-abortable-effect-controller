import { EffectController } from './effect-controller'

export function createSocket(
    configs: {
        url: string | URL
        protocols?: string | string[]
    },
    controller: EffectController = new EffectController()
) {
    controller.assertCanCreateAsyncTask('WebSocket')

    const socket = new WebSocket(configs.url, configs.protocols)
    controller.onCleanup(() => {
        socket.close()
    })

    return [socket, controller]
}
